import { CommandsRegistry, registerCommand, handlerLogin, runCommand } from "./commands/commands";

function main() {
    const commandsRegistry: CommandsRegistry = { commands: {} };
    registerCommand(commandsRegistry, "login", handlerLogin);

    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("Error: Not enough arguments provided.");
        process.exit(1);
    }

    const [cmdName, ...cmdArgs] = args;

    try {
        runCommand(commandsRegistry, cmdName, ...cmdArgs);
    } catch (error) {
        console.error(error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}

main();