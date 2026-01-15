import { deleteFeedFollow } from "../lib/db/queries/feed_follows";
import { User } from "./addfeed";

export async function handlerUnfollow(cmdName: string, user: User, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <url>`);
    }

    const [url] = args;

    // Delete the feed follow record
    const deletedFollow = await deleteFeedFollow(user.id, url);

    // Print confirmation
    console.log(`Unfollowed feed: ${deletedFollow.feedName}`);
    console.log(`User: ${deletedFollow.userName}`);
}
