import fs from "node:fs/promises";
import process from "node:process";
import path from "node:path"

const filepath = path.join('02-event-loop-and-async', 'data.txt');

async function runFileOP() { }
try {
    console.log("Starting operation:");

    await fs.writeFile(filepath, 'Hello! This file was created by Node.js.\n');
    await fs.appendFile(filepath, 'This is line 2.\n');

    const ghostFile = path.join('02-event-loop-and-async', 'does-not-exist.txt');
    const content = await fs.readFile(ghostFile, 'utf-8');
    console.log(content);

} catch (error) {
    if (error.code === 'ENOENT') {
        console.log("\nCaught Expected Error: The file was not found (ENOENT)!");
        console.log("The server did NOT crash. Continuing smoothly...");
    } else {
        console.error("An unexpected error occurred:", error.message);
    }
}
runFileOP();
console.log("[Main Thread]: I am NOT waiting for the hard drive!");