import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { createFeed } from "../lib/db/queries/feeds";
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

export async function handlerAddFeed(cmdName: string, ...args: string[]) {
    if (args.length !== 2) {
        throw new Error(`usage: ${cmdName} <name> <url>`);
    }

    const [name, url] = args;

    // Get the current user from the database
    const config = readConfig();
    const currentUser = await getUserByName(config.currentUserName);
    if (!currentUser) {
        throw new Error(`Current user "${config.currentUserName}" not found`);
    }

    // Create the feed
    const feed = await createFeed(name, url, currentUser.id);

    // Print the feed information
    printFeed(feed, currentUser);
}
