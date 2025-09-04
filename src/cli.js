import readline from "readline";
import { respond } from "./rule_engine.js";

console.log("Therapist CLI. Type your message; Ctrl+C to exit.");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let context = {};

function ask() {
  rl.question("> ", (line) => {
    const result = respond(line, context);

    const replyText = result.response;
    console.log(replyText);

    context = result.ctx;

    ask();
  });
}
ask();
