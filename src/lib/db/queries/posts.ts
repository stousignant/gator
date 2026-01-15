import { eq, desc, and } from "drizzle-orm";
import { db } from "..";
import { posts, feedFollows, feeds } from "../schema";

export async function createPost(
    title: string,
    url: string,
    description: string | null,
    publishedAt: Date | null,
    feedId: string
) {
    try {
        const [result] = await db
            .insert(posts)
            .values({
                title,
                url,
                description,
                publishedAt,
                feedId,
            })
            .returning();
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
            // Post with this URL already exists, return null to indicate it wasn't created
            return null;
        }
        throw new Error(`Failed to create post: ${errorMessage}`);
    }
}

export async function getPostsForUser(userId: string, limit: number = 10) {
    try {
        const result = await db
            .select({
                id: posts.id,
                createdAt: posts.createdAt,
                updatedAt: posts.updatedAt,
                title: posts.title,
                url: posts.url,
                description: posts.description,
                publishedAt: posts.publishedAt,
                feedId: posts.feedId,
                feedName: feeds.name,
            })
            .from(posts)
            .innerJoin(feeds, eq(posts.feedId, feeds.id))
            .innerJoin(feedFollows, eq(feeds.id, feedFollows.feedId))
            .where(eq(feedFollows.userId, userId))
            .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
            .limit(limit);
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to query posts: ${errorMessage}`);
    }
}