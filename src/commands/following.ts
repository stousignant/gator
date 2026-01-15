import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";

export async function handlerFollowing(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }

    // Get the current user from the database
    const config = readConfig();
    const currentUser = await getUserByName(config.currentUserName);
    if (!currentUser) {
        throw new Error(`Current user "${config.currentUserName}" not found`);
    }

    // Get all feed follows for the current user
    const feedFollows = await getFeedFollowsForUser(currentUser.id);

    // Print all the feed names
    for (const feedFollow of feedFollows) {
        console.log(feedFollow.feedName);
    }
}
