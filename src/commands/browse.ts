import { getPostsForUser } from "../lib/db/queries/posts";
import { User } from "./addfeed";

export async function handlerBrowse(cmdName: string, user: User, ...args: string[]) {
    let limit = 2; // Default limit

    if (args.length > 1) {
        throw new Error(`usage: ${cmdName} [limit]`);
    }

    if (args.length === 1) {
        const parsedLimit = parseInt(args[0], 10);
        if (isNaN(parsedLimit) || parsedLimit < 1) {
            throw new Error(`Invalid limit: ${args[0]}. Must be a positive integer.`);
        }
        limit = parsedLimit;
    }

    const posts = await getPostsForUser(user.id, limit);

    if (posts.length === 0) {
        console.log("No posts found.");
        return;
    }

    for (const post of posts) {
        console.log(`[${post.feedName}] ${post.title}`);
        console.log(`  ${post.url}`);
        if (post.description) {
            // Truncate description if it's too long
            const maxDescLength = 100;
            const description = post.description.length > maxDescLength
                ? post.description.substring(0, maxDescLength) + "..."
                : post.description;
            console.log(`  ${description}`);
        }
        if (post.publishedAt) {
            console.log(`  Published: ${post.publishedAt.toISOString()}`);
        }
        console.log();
    }
}