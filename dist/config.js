import fs from "fs";
import os from "os";
import path from "path";
const CONFIG_FILE_NAME = ".gatorconfig.json";
const DB_URL = "postgres://example";
export function setUser(userName) {
    let data = {
        dbUrl: DB_URL,
        currentUserName: userName,
    };
    writeConfig(data);
}
export function readConfig() {
    const configContent = fs.readFileSync(getConfigFilePath(), "utf-8");
    return validateConfig(JSON.parse(configContent));
}
function getConfigFilePath() {
    return path.join(os.homedir(), CONFIG_FILE_NAME);
}
function writeConfig(cfg) {
    fs.writeFileSync(getConfigFilePath(), JSON.stringify(cfg));
}
function validateConfig(rawConfig) {
    if (typeof rawConfig.dbUrl !== "string" || typeof rawConfig.currentUserName !== "string") {
        throw new Error("Invalid config file");
    }
    return rawConfig;
}
