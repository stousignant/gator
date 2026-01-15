import { eq, and } from "drizzle-orm";
import { db } from "..";
import { feedFollows, feeds, users } from "../schema";
import { getFeedByUrl } from "./feeds";

export async function createFeedFollow(userId: string, feedId: string) {
    try {
        const [newFeedFollow] = await db
            .insert(feedFollows)
            .values({ userId, feedId })
            .returning();

        // Now fetch the full record with joined data
        const [result] = await db
            .select({
                id: feedFollows.id,
                createdAt: feedFollows.createdAt,
                updatedAt: feedFollows.updatedAt,
                userId: feedFollows.userId,
                feedId: feedFollows.feedId,
                userName: users.name,
                feedName: feeds.name,
            })
            .from(feedFollows)
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .where(eq(feedFollows.id, newFeedFollow.id));

        if (!result) {
            throw new Error("Failed to retrieve created feed follow");
        }

        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
            throw new Error("User is already following this feed");
        }
        throw new Error(`Failed to create feed follow: ${errorMessage}`);
    }
}

export async function getFeedFollowsForUser(userId: string) {
    try {
        const result = await db
            .select({
                id: feedFollows.id,
                createdAt: feedFollows.createdAt,
                updatedAt: feedFollows.updatedAt,
                userId: feedFollows.userId,
                feedId: feedFollows.feedId,
                userName: users.name,
                feedName: feeds.name,
            })
            .from(feedFollows)
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .where(eq(feedFollows.userId, userId));

        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to query feed follows: ${errorMessage}`);
    }
}

export async function deleteFeedFollow(userId: string, feedUrl: string) {
    try {
        // Look up the feed by URL
        const feed = await getFeedByUrl(feedUrl);
        if (!feed) {
            throw new Error(`Feed with URL "${feedUrl}" not found`);
        }

        // First, get the feed follow record to return information about what was deleted
        const [feedFollow] = await db
            .select({
                id: feedFollows.id,
                createdAt: feedFollows.createdAt,
                updatedAt: feedFollows.updatedAt,
                userId: feedFollows.userId,
                feedId: feedFollows.feedId,
                userName: users.name,
                feedName: feeds.name,
            })
            .from(feedFollows)
            .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
            .innerJoin(users, eq(feedFollows.userId, users.id))
            .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id)));

        if (!feedFollow) {
            throw new Error("User is not following this feed");
        }

        // Delete the feed follow record
        await db
            .delete(feedFollows)
            .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feed.id)));

        return feedFollow;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to delete feed follow: ${errorMessage}`);
    }
}
