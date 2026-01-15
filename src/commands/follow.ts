import { getFeedByUrl } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { User } from "./addfeed";

export async function handlerFollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const [url] = args;

    // Look up the feed by URL
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with URL "${url}" not found`);
    }

    // Create the feed follow record
    const feedFollow = await createFeedFollow(user.id, feed.id);

    // Print the feed name and current user name
    console.log(`Following feed: ${feedFollow.feedName}`);
    console.log(`User: ${feedFollow.userName}`);
}
