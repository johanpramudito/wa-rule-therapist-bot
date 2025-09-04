/**
 * Rule-based "therapist-style" engine with regex patterns and pronoun reflection.
 * Inspired by ELIZA, but more empathetic.
 * Created by Johan and Fajrul.
 */

// Pronoun reflection map
const REFLECTIONS = new Map([
  ["saya", "kamu"],
  ["aku", "kamu"],
  ["gue", "lu"],
  ["gua", "lu"],
  ["kamu", "saya"],
  ["anda", "saya"],
  ["lu", "gue"],
  ["lo", "gue"],
  ["punyaku", "punyamu"],
  ["punyamu", "punyaku"],
  ["diriku", "dirimu"],
  ["dirimu", "diriku"],
  ["aku merasa", "kamu merasa"],
  ["saya merasa", "kamu merasa"],
]);

function reflect(text) {
  return text
    .split(/\b/)
    .map((tok) => {
      const lower = tok.toLowerCase();
      if (REFLECTIONS.has(lower)) {
        const repl = REFLECTIONS.get(lower);
        if (tok[0] === tok[0]?.toUpperCase()) {
          return repl[0].toUpperCase() + repl.slice(1);
        }
        return repl;
      }
      return tok;
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function choose(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const FALLBACKS = [
  "Hmm, boleh ceritakan lebih dalam lagi?",
  "Aku mendengarkanmu. Apa yang menurutmu paling berat saat ini?",
  "Terima kasih sudah berbagi. Bagian mana yang paling mengganggumu?",
  "Aku ingin memahami lebih baik. Bisa kamu ceritakan lebih detail?",
];

// Aturan dalam Bahasa Indonesia & English
const RULES = [
  {
    pattern: /\b(hai|halo|ass?alamualaikum|selamat (pagi|siang|malam))\b/i,
    reply: () =>
      choose([
        "Halo, apa kabar hatimu hari ini?",
        "Hai 👋 bagaimana perasaanmu saat ini?",
        "Waalaikumussalam, aku senang bisa mendengarmu. Apa yang sedang kamu rasakan?",
      ]),
  },
  {
    pattern: /\b(aku|saya) butuh (.+)/i,
    reply: (m) => `Kenapa menurutmu kamu butuh ${reflect(m[2])}?`,
  },
  {
    pattern: /\b(aku|saya) merasa (.+)/i,
    reply: (m) =>
      choose([
        `Wajar kalau kamu merasa ${reflect(
          m[2]
        )}. Apa yang biasanya memicu perasaan itu?`,
        `Perasaan ${reflect(
          m[2]
        )} memang berat. Apa yang kamu lakukan biasanya ketika begini?`,
      ]),
  },
  {
    pattern: /\b(aku|saya|gue) sedang (.+)/i,
    reply: (m) =>
      choose([
        `Terima kasih sudah jujur, kamu sedang ${reflect(
          m[2]
        )}. Apa yang bisa sedikit membantu sekarang?`,
        `Sedang ${reflect(m[2])} ya... bagaimana biasanya kamu menghadapinya?`,
      ]),
  },
  {
    pattern: /\bkarena (.+)/i,
    reply: (m) =>
      `Aku mengerti. Jadi karena ${reflect(m[1])}, apa artinya itu buatmu?`,
  },
  {
    pattern: /\bsiapa kamu\b/i,
    reply: () =>
      "Aku hanyalah chatbot pendengar, bukan terapis sungguhan, tapi aku akan berusaha memahami ceritamu.",
  },
  {
    pattern: /\b(stres|capek|lelah|tertekan)\b/i,
    reply: () =>
      choose([
        "Kedengarannya melelahkan. Apa yang paling bikin kamu merasa tertekan?",
        "Capek itu wajar, tubuh dan hati butuh istirahat. Apa kamu sudah coba rehat sejenak?",
      ]),
  },
  {
    pattern: /\b(sedih|kecewa|hampa|murung)\b/i,
    reply: () =>
      choose([
        "Aku bisa merasakan kesedihanmu lewat kata-katamu. Apa yang membuatmu merasa seperti itu?",
        "Perasaan sedih kadang sulit diungkapkan. Menurutmu, siapa yang bisa mengerti perasaanmu saat ini?",
      ]),
  },
  {
    pattern: /\b(marah|kesal|jengkel|frustrasi)\b/i,
    reply: () =>
      choose([
        "Aku paham kamu sedang marah. Apa yang paling bikin kamu tersulut?",
        "Rasa marah itu wajar, tapi bisa melelahkan. Bagaimana biasanya kamu meredakannya?",
        "Kesal banget ya rasanya. Apa yang menurutmu bisa bikin lebih lega?",
      ]),
  },
  {
    pattern: /\b(senang|bahagia|lega|gembira|puas)\b/i,
    reply: () =>
      choose([
        "Ikut senang dengarnya! Apa yang membuatmu merasa begitu?",
        "Bahagia itu berharga. Apa yang paling kamu syukuri saat ini?",
        "Wah, itu kabar baik! Apa yang ingin kamu rayakan dari perasaan ini?",
      ]),
  },
  {
    pattern: /\b(kenapa|mengapa) (.+)/i,
    reply: (m) =>
      `Pertanyaan bagus. Menurutmu sendiri, kenapa ${reflect(m[2])}?`,
  },
  {
    pattern: /(.+)/i,
    reply: (m) =>
      choose([
        `Saat kamu bilang "${reflect(m[1])}", apa maksud terdalammu?`,
        `Kalau seorang temanmu mengalami "${reflect(
          m[1]
        )}", apa yang akan kamu katakan kepadanya?`,
        `Apa yang kamu harapkan berubah dari "${reflect(m[1])}"?`,
      ]),
  },
];

function respond(input, ctx = {}) {
  if (!input || !input.trim()) {
    return "Aku ada di sini kapan pun kamu siap untuk berbagi.";
  }
  for (const rule of RULES) {
    const m = input.match(rule.pattern);
    if (m) {
      const out = rule.reply(m, input, ctx);
      return Array.isArray(out) ? choose(out) : out;
    }
  }
  return choose(FALLBACKS);
}

module.exports = { respond, reflect, RULES };
