import { setUser } from "../config";
import { createUser, getUserByName } from "../lib/db/queries/users";

export async function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length !== 1) {
        throw new Error(`usage: ${cmdName} <name>`);
    }

    const userName = args[0];
    setUser(userName);
    console.log(`Username ${userName} has been successfully set.`);
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