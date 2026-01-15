import { setUser } from "./config";

type CommandHandler = (cmdName: string, ...args: string[]) => void;

export type CommandsRegistry = {
    commands: Record<string, CommandHandler>,
}

export function handlerLogin(cmdName: string, ...args: string[]) {
    if (args.length < 1) {
        throw new Error("The login handler expects a single argument, the username.");
    }

    const userName = args[0];
    setUser(userName);
    console.log(`Username ${userName} has been successfully set.`);
}

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry.commands[cmdName] = handler;
}

export function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const command = registry.commands[cmdName];
    command(cmdName, ...args);
}