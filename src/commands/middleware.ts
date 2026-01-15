import { readConfig } from "../config";
import { getUserByName } from "../lib/db/queries/users";
import { CommandHandler, UserCommandHandler } from "./commands";
import { User } from "./addfeed";

export function middlewareLoggedIn(handler: UserCommandHandler): CommandHandler {
  return async (cmdName: string, ...args: string[]) => {
    // Get the current user from the database
    const config = readConfig();
    const user = await getUserByName(config.currentUserName);
    if (!user) {
      throw new Error(`User ${config.currentUserName} not found`);
    }

    // Call the handler with the user as the second argument
    await handler(cmdName, user, ...args);
  };
}
