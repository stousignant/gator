import { createFeed } from "../lib/db/queries/feeds";
import { createFeedFollow } from "../lib/db/queries/feed_follows";
import { feeds, users } from "../lib/db/schema";

export type Feed = typeof feeds.$inferSelect;
export type User = typeof users.$inferSelect;

export function printFeed(feed: Feed, user: User) {
    console.log("Feed ID:", feed.id);
    console.log("Feed Name:", feed.name);
    console.log("Feed URL:", feed.url);
    console.log("User ID:", feed.userId);
    console.log("User Name:", user.name);
    console.log("Created At:", feed.createdAt);
    console.log("Updated At:", feed.updatedAt);
}

export async function handlerAddFeed(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const [name, url] = args;

    // Create the feed
    const feed = await createFeed(name, url, user.id);

    // Automatically create a feed follow record for the current user
    const feedFollow = await createFeedFollow(user.id, feed.id);

    // Print the feed name and current user name
    console.log(`Feed: ${feedFollow.feedName}`);
    console.log(`User: ${feedFollow.userName}`);
}
