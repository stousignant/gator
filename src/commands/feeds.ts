import { getFeedsWithUsers } from "../lib/db/queries/feeds";

export async function handlerFeeds(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }

    const feeds = await getFeedsWithUsers();

    for (const feed of feeds) {
        console.log(`* ${feed.feedName} (${feed.feedUrl}) - ${feed.userName}`);
    }
}
