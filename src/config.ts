import fs from "fs";
import os from "os";
import path from "path";

const CONFIG_FILE_NAME = ".gatorconfig.json";
const DB_URL = "postgres://example";

export type Config = {
    dbUrl: string,
    currentUserName: string,
}

export function setUser(userName: string) {
    let data: Config = {
        dbUrl: DB_URL,
        currentUserName: userName,
    }
    writeConfig(data);
}

export function readConfig(): Config {
    const configContent = fs.readFileSync(getConfigFilePath(), "utf-8");
    return validateConfig(JSON.parse(configContent));
}

function getConfigFilePath(): string {
    return path.join(os.homedir(), CONFIG_FILE_NAME);
}

function writeConfig(cfg: Config): void {
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(cfg));
}

function validateConfig(rawConfig: any): Config {
    if (typeof rawConfig.dbUrl !== "string" || typeof rawConfig.currentUserName !== "string") {
        throw new Error("Invalid config file");
    }
    return rawConfig as Config;
}