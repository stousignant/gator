import { CommandsRegistry, registerCommand, runCommand } from "./commands/commands";
import { handlerAgg } from "./commands/agg";
import { handlerLogin, handlerRegister, handlerReset, handlerUsers } from "./commands/users";
import { handlerAddFeed } from "./commands/addfeed";
import { handlerFeeds } from "./commands/feeds";
import { handlerFollow } from "./commands/follow";
import { handlerFollowing } from "./commands/following";
import { handlerUnfollow } from "./commands/unfollow";
import { handlerBrowse } from "./commands/browse";
import { middlewareLoggedIn } from "./commands/middleware";

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.log("usage: cli <command> [args...]");
        process.exit(1);
    }

    const [cmdName, ...cmdArgs] = args;
    const commandsRegistry: CommandsRegistry = {};

    registerCommand(commandsRegistry, "agg", handlerAgg);
    registerCommand(commandsRegistry, "login", handlerLogin);
    registerCommand(commandsRegistry, "register", handlerRegister);
    registerCommand(commandsRegistry, "reset", handlerReset);
    registerCommand(commandsRegistry, "users", handlerUsers);
    registerCommand(commandsRegistry, "addfeed", middlewareLoggedIn(handlerAddFeed));
    registerCommand(commandsRegistry, "feeds", handlerFeeds);
    registerCommand(commandsRegistry, "follow", middlewareLoggedIn(handlerFollow));
    registerCommand(commandsRegistry, "following", middlewareLoggedIn(handlerFollowing));
    registerCommand(commandsRegistry, "unfollow", middlewareLoggedIn(handlerUnfollow));
    registerCommand(commandsRegistry, "browse", middlewareLoggedIn(handlerBrowse));

    try {
        await runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }

    process.exit(0);
}

main();