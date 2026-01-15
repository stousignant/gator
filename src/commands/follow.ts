import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { getFeedByUrl } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feed_follows";

export async function handlerFollow(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const [url] = args;

    // Get the current user from the database
    const config = readConfig();
    const currentUser = await getUserByName(config.currentUserName);
    if (!currentUser) {
        throw new Error(`Current user "${config.currentUserName}" not found`);
    }

    // Look up the feed by URL
    const feed = await getFeedByUrl(url);
    if (!feed) {
        throw new Error(`Feed with URL "${url}" not found`);
    }

    // Create the feed follow record
    const feedFollow = await createFeedFollow(currentUser.id, feed.id);

    // Print the feed name and current user name
    console.log(`Following feed: ${feedFollow.feedName}`);
    console.log(`User: ${feedFollow.userName}`);
}
