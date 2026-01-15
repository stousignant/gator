import { fetchFeed } from "../lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "../lib/db/queries/feeds";

function parseDuration(durationStr: string): number {
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        throw new Error(`Invalid duration format: ${durationStr}. Expected format: <number><unit> where unit is ms, s, m, or h`);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case "ms":
            return value;
        case "s":
            return value * 1000;
        case "m":
            return value * 60 * 1000;
        case "h":
            return value * 60 * 60 * 1000;
        default:
            throw new Error(`Unknown duration unit: ${unit}`);
    }
}

function formatDuration(durationStr: string): string {
    // Simple formatting: for minutes/hours, show as "1m0s" format
    const regex = /^(\d+)(ms|s|m|h)$/;
    const match = durationStr.match(regex);

    if (!match) {
        return durationStr;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    if (unit === "m") {
        return `${value}m0s`;
    } else if (unit === "h") {
        return `${value}h0m`;
    }

    return durationStr;
}

async function scrapeFeeds() {
    const feed = await getNextFeedToFetch();

    if (!feed) {
        console.log("No feeds to fetch");
        return;
    }

    await markFeedFetched(feed.id);

    try {
        const rssFeed = await fetchFeed(feed.url);

        for (const item of rssFeed.channel.item) {
            console.log(item.title);
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`Failed to fetch feed ${feed.url}: ${errorMessage}`);
    }
}

function handleError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${errorMessage}`);
}

export async function handlerAgg(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <time_between_reqs>`);
    }

    const timeBetweenReqsStr = args[0];
    const timeBetweenReqs = parseDuration(timeBetweenReqsStr);
    const formattedDuration = formatDuration(timeBetweenReqsStr);

    console.log(`Collecting feeds every ${formattedDuration}`);

    // Run once immediately
    scrapeFeeds().catch(handleError);

    const interval = setInterval(() => {
        scrapeFeeds().catch(handleError);
    }, timeBetweenReqs);

    // Wait for SIGINT to stop the loop
    await new Promise<void>((resolve) => {
        process.on("SIGINT", () => {
            console.log("Shutting down feed aggregator...");
            clearInterval(interval);
            resolve();
        });
    });
}
