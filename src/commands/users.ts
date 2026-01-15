import { setUser } from "../config";
import { createUser, getUserByName, reset } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    const existingUser = await getUserByName(userName);
    if (!existingUser) {
        throw new Error(`User "${userName}" does not exist`);
    }

    setUser(existingUser.name);
    console.log(`Username ${existingUser.name} has been successfully set.`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];

    // Check if user already exists
    const existingUser = await getUserByName(userName);
    if (existingUser) {
        throw new Error(`User "${userName}" already exists`);
    }

    // Create the user
    const user = await createUser(userName);

    // Set the current user in config
    setUser(userName);

    // Print success message and log user data
    console.log(`User "${userName}" was created successfully.`);
    console.log("User data:", user);
}

export async function handlerReset(cmdName: string, ...args: string[]) {
    if (args.length !== 0) {
        throw new Error(`usage: ${cmdName}`);
    }

    try {
        await reset();
        console.log("All users have been successfully deleted.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to reset users: ${errorMessage}`);
    }
}