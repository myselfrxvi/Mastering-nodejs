import process from "node:process"
import { CalculateAge } from "./calculator.js";
console.log("Hello from node.js")

console.log("Full arg. array:\n", process.argv)

const userInput = process.argv.slice(2)
if (userInput.length < 2) {
    console.log("No userInput provided \nUsage: node app.js <your-name> <birth-year>");
    process.exit(1);
}

const name = userInput[0]
const yob = Number(userInput[1])
const currAge = CalculateAge(yob)

console.log(`\n Hello ${name}! You are approx ${currAge} years old.`);