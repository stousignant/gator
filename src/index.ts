import { setUser, readConfig } from "./config";

function main() {
    setUser("Sacha");
    const configContent = readConfig();
    console.log("Config content:", configContent);
}

main();