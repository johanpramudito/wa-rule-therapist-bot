# 🧠 WhatsApp Therapist Bot (Rule-Based NLP)

Chatbot WhatsApp sederhana berbasis **rule-based NLP** (mirip ELIZA klasik) untuk memberikan respon empatik saat pengguna chat di WhatsApp.  
Bot ini dibangun menggunakan [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) + **Node.js**.
Dibuat oleh Alexander Johan Pramudito dan Muhammad Fajrulfalaq Izzulfirdausyah Suryaprabandaru.

---

## 🚀 Fitur

- 📲 Terhubung langsung ke WhatsApp Web (via Puppeteer).
- 🧠 Rule-based NLP sederhana (respon otomatis sesuai pola teks).
- 🔐 Menyimpan sesi login WhatsApp → tidak perlu scan QR berulang kali.
- 🔄 Script `reset-session` untuk menghapus sesi login.

---

## ⚙️ Instalasi

1. **Clone repo**
   ```bash
   git clone https://github.com/johanpramudito/wa-rule-therapist-bot.git
   cd wa-rule-therapist-bot
   ```
2. **Install dependency**
   ```bash
   npm install
   ```
3. **Buat file .env**
   ```bash
   WA_SESSION_NAME=nama_session
   ```

## ▶️ Menjalankan Bot

1. Start bot:
   ```bash
   npm start
   ```
2. Scan QR yang muncul di terminal menggunakan aplikasi WhatsApp di HP.
3. Setelah login, sesi akan tersimpan di folder .wwebjs_auth/ → tidak perlu scan ulang.
4. Chat ke nomor WhatsApp yang login → bot akan membalas otomatis sesuai rule di src/nlp.js.

## 🔄 Reset Session

Jika login bermasalah (QR expired / ingin ganti akun), jalankan:

```bash
npm run reset-session
npm start
```

Script ini akan menghapus session di .wwebjs_auth/<sessionName>.

## 📌 Catatan

- Jangan gunakan di nomor WhatsApp utama → sebaiknya pakai nomor cadangan.
- Bot ini masih rule-based, bukan AI → jawabannya terbatas pada pola yang diatur.
- Disarankan pakai Node.js LTS 20.x agar stabil.
