/**
 * This is the main index for the WhatsApp therapist bot.
 * It uses whatsapp-web.js to connect to WhatsApp and respond to messages.
 * Created by Johan and Fajrul.
 */

const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { respond } = require("./rule_engine.js");

dotenv.config();

const sessionName = process.env.WA_SESSION_NAME || "therapist-bot-session";
const LOG_LEVEL = (process.env.LOG_LEVEL || "info").toLowerCase();
const logFile = path.join(__dirname, "..", "logs", "bot.log");

// simple logger
function log(level, msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] [${level}] ${msg}`;
  if (
    LOG_LEVEL === "debug" ||
    level === "error" ||
    (LOG_LEVEL === "info" && (level === "info" || level === "warn"))
  ) {
    console.log(line);
  }
  fs.appendFileSync(logFile, line + "\n");
}

// declare client at top (will be reassigned)
let client;

function reconnectClient() {
  if (client) {
    try {
      client.destroy();
    } catch (e) {
      log("warn", "Error while destroying old client: " + e.message);
    }
  }

  log("info", "🚀 Initializing WhatsApp client...");

  client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionName }),
    // Remove puppeteer configuration completely
  });
  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    log("info", "📷 QR generated. Scan with WhatsApp.");
  });

  // Add these new event listeners for debugging
  client.on("authenticated", () => {
    log("info", "🔐 Authentication successful!");
  });

  client.on("loading_screen", (percent, message) => {
    log("info", `⏳ Loading: ${percent}% - ${message}`);
  });

  client.on("change_state", (state) => {
    log("info", `🔄 State changed to: ${state}`);
  });

  client.on("ready", () => {
    log("info", "✅ WhatsApp client is ready.");
  });

  client.on("auth_failure", (m) => {
    log("error", `Auth failure: ${m}`);
    log("warn", "💡 Coba jalankan: npm run reset-session");
    setTimeout(reconnectClient, 5000);
  });

  client.on("disconnected", (r) => {
    log("warn", `Disconnected: ${r}`);
    setTimeout(reconnectClient, 5000);
  });

  client.on("message", async (message) => {
    try {
      const text = (message.body || "").trim();
      if (!text) return;
      const reply = respond(text, { from: message.from });
      await message.reply(reply);
      log("info", `From ${message.from}: "${text}" -> "${reply}"`);
    } catch (err) {
      log("error", `Handler error: ${err?.stack || err}`);
      try {
        await message.reply("Sorry, I ran into an issue processing that.");
      } catch {}
    }
  });

  client.initialize();
}

// start first client
reconnectClient();
