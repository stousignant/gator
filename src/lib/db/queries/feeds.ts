import { eq, sql } from "drizzle-orm";
import { db } from "..";
import { feeds, users } from "../schema";

export async function createFeed(name: string, url: string, userId: string) {
    try {
        const [result] = await db
            .insert(feeds)
            .values({ name, url, userId })
            .returning();
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
            throw new Error(`Feed with URL "${url}" already exists`);
        }
        throw new Error(`Failed to create feed: ${errorMessage}`);
    }
}

export async function getFeedsWithUsers() {
    try {
        const result = await db
            .select({
                feedId: feeds.id,
                feedName: feeds.name,
                feedUrl: feeds.url,
                userId: feeds.userId,
                userName: users.name,
                createdAt: feeds.createdAt,
                updatedAt: feeds.updatedAt,
            })
            .from(feeds)
            .innerJoin(users, eq(feeds.userId, users.id));
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to query feeds: ${errorMessage}`);
    }
}

export async function getFeedByUrl(url: string) {
    try {
        const [result] = await db.select().from(feeds).where(eq(feeds.url, url));
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to query feed by URL: ${errorMessage}`);
    }
}

export async function markFeedFetched(feedId: string) {
    try {
        const now = new Date();
        const [result] = await db
            .update(feeds)
            .set({
                lastFetchedAt: now,
                updatedAt: now,
            })
            .where(eq(feeds.id, feedId))
            .returning();
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to mark feed as fetched: ${errorMessage}`);
    }
}

export async function getNextFeedToFetch() {
    try {
        const [result] = await db
            .select()
            .from(feeds)
            .orderBy(sql`${feeds.lastFetchedAt} ASC NULLS FIRST`)
            .limit(1);
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to get next feed to fetch: ${errorMessage}`);
    }
}
