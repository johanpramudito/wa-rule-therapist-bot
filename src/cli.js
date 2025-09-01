import readline from "readline";
import { respond } from "./rule_engine.js";

console.log("Therapist CLI. Type your message; Ctrl+C to exit.");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask() {
  rl.question("> ", (line) => {
    const out = respond(line);
    console.log(out);
    ask();
  });
}
ask();
