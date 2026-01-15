import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";

export async function createUser(name: string) {
    try {
        const [result] = await db.insert(users).values({ name: name }).returning();
        return result;
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("duplicate key") || errorMessage.includes("unique constraint")) {
            throw new Error(`User "${name}" already exists`);
        }
        // Re-throw with more context for other database errors
        throw new Error(`Failed to create user: ${errorMessage}`);
    }
}

export async function getUserByName(name: string) {
    try {
        const [result] = await db.select().from(users).where(eq(users.name, name));
        return result;
    } catch (error) {
        // Re-throw with more context
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to query user: ${errorMessage}`);
    }
}