import { getFeedFollowsForUser } from "../lib/db/queries/feed_follows";
import { User } from "./addfeed";

export async function handlerFollowing(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }

    // Get all feed follows for the current user
    const feedFollows = await getFeedFollowsForUser(user.id);

    // Print all the feed names
    for (const feedFollow of feedFollows) {
        console.log(feedFollow.feedName);
    }
}
