import { XMLParser } from "fast-xml-parser";

export type RSSItem = {
    title: string;
    link: string;
    description?: string;
    pubDate?: string;
};

export type RSSFeed = {
    channel: {
        title: string;
        link: string;
        description: string;
        item: RSSItem[];
    };
};

export async function fetchFeed(feedURL: string): Promise<RSSFeed> {
    // Fetch the feed data
    const response = await fetch(feedURL, {
        headers: {
            "User-Agent": "gator",
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }

    const xmlText = await response.text();

    // Parse the XML
    const parser = new XMLParser();
    const parsed = parser.parse(xmlText);

    // Extract the channel field
    if (!parsed.rss || !parsed.rss.channel) {
        throw new Error("Invalid RSS feed: missing channel field");
    }

    const channel = parsed.rss.channel;

    // Extract metadata
    if (!channel.title || !channel.link || !channel.description) {
        throw new Error("Invalid RSS feed: missing required channel fields (title, link, or description)");
    }

    const title = channel.title;
    const link = channel.link;
    const description = channel.description;

    // Extract feed items
    let items: RSSItem[] = [];

    if (channel.item) {
        if (Array.isArray(channel.item)) {
            items = channel.item;
        } else {
            items = [channel.item];
        }
    }

    // Filter items to only include those with required fields (title and link)
    const validItems: RSSItem[] = [];
    for (const item of items) {
        if (item.title && item.link) {
            validItems.push({
                title: item.title,
                link: item.link,
                description: item.description,
                pubDate: item.pubDate,
            });
        }
    }

    // Assemble the result
    return {
        channel: {
            title,
            link,
            description,
            item: validItems,
        },
    };
}
