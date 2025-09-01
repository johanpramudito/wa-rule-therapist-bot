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
const puppeteer = require("puppeteer");

dotenv.config();

const sessionName = process.env.WA_SESSION_NAME || "therapist-bot-session";
const LOG_LEVEL = (process.env.LOG_LEVEL || "info").toLowerCase();
const logFile = path.join(__dirname, "..", "logs", "bot.log");

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

function clearSession() {
  const sessionPath = path.join(__dirname, "..", ".wwebjs_auth", sessionName);
  if (fs.existsSync(sessionPath)) {
    fs.rmSync(sessionPath, { recursive: true, force: true });
    log("info", "🗑️ Session folder cleared.");
  }
}

let client;

function reconnectClient() {
  if (client) {
    try {
      client.destroy();
    } catch {}
    client = null;
  }

  log("info", "🚀 Initializing WhatsApp client...");

  client = new Client({
    authStrategy: new LocalAuth({ clientId: sessionName }),
    puppeteer: {
      headless: true,
      executablePath: puppeteer.executablePath(), // pakai Chromium yang diunduh puppeteer
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    log("info", "📷 QR generated. Scan with WhatsApp.");
  });

  client.on("ready", () => {
    log("info", "✅ WhatsApp client is ready.");
  });

  client.on("auth_failure", (m) => {
    log("error", `Auth failure: ${m}`);
    clearSession();
    reconnectClient();
  });

  client.on("disconnected", (reason) => {
    log("warn", `⚠️ Disconnected: ${reason}`);
    clearSession();
    reconnectClient();
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

// Start pertama kali
reconnectClient();
