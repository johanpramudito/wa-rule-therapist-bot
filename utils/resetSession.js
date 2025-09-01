const fs = require("fs");
const path = require("path");

const sessionName =
  process.env.WA_SESSION_NAME || "session-therapist-bot-session";
const authDir = path.join(__dirname, "..", ".wwebjs_auth", sessionName);

if (fs.existsSync(authDir)) {
  fs.rmSync(authDir, { recursive: true, force: true });
  console.log(`✅ Session "${sessionName}" sudah dihapus.`);
} else {
  console.log(`ℹ️ Session "${sessionName}" tidak ditemukan.`);
}
