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
  ["dariku", "darimu"],
  ["darimu", "dariku"],
  ["denganku", "denganmu"],
  ["denganmu", "denganku"],
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

const CONTEXTUAL_RULES = {
  awaiting_support_person: {
    pattern: /(.+)/i,
    reply: (m) =>
      choose([
        `Itu bagus. aktivitas dengan ${m[1]} bisa sangat membantu. Ingat, orang yang selalu bangkit adalah tanda kekuatan.`,
        `Benar sekali, tetap semangat yaa. Aku harap ${m[1]} bisa memberimu dukungan yang kamu butuhkan. Kamu pantas mendapatkannya.`,
      ]),
  },
  awaiting_trigger: {
    pattern: /(.+)/i,
    reply: (m) =>
        `Aku mengerti. Jadi, ${m[1]} adalah pemicunya ya. Terima kasih sudah menyadarinya, itu adalah langkah pertama yang penting.`,
  },
};

// Aturan dalam Bahasa Indonesia & English
const RULES = [
  {
    pattern: /\b(hai|halo|selamat (pagi|siang|malam))\b/i,
    reply: () =>
      choose([
        "Halo, apa kabar hatimu hari ini?",
        "Hai 👋 bagaimana perasaanmu saat ini?",
      ]),
  },
    {
    pattern: /\b(ass?alamualaikum)\b/i,
    reply: () =>
      choose([
        "Waalaikumussalam, aku senang bisa mendengarmu. Apa yang sedang kamu rasakan?",
      ]),
  },
  {
    pattern: /\b(makasih|terima kasih|thanks|makasi)\b/i,
    reply: () =>
      choose([
        "Sama-sama. Ingat, kamu tidak sendirian. Aku di sini jika kamu butuh teman bicara lagi.",
        "Tentu, senang bisa mendengarkan. Jaga dirimu baik-baik ya.",
        "Tentu saja. Kapan pun kamu merasa perlu bicara, aku siap mendengarkan.",
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
    pattern: /(?=.*\bsiapa\b)(?=.*\bkamu\b)/i,
    reply: () =>
      "Aku hanyalah chatbot pendengar, bukan terapis sungguhan, tapi aku akan berusaha memahami ceritamu.",
  },
  {
    pattern: /\b(stres|capek|lelah|tertekan)\b/i,
    reply: (m, input, ctx) => {
        ctx.lastQuestion = "awaiting_trigger"; // Set penanda
        return choose([
            "Kedengarannya melelahkan. apa yang paling bikin kamu merasa lelah?",
            "Capek itu wajar, tubuh dan hati butuh istirahat. Apa kamu sudah coba rehat sejenak?",
        ]);
    }
  },
  {
    pattern: /\b(sedih|kecewa|hampa|murung)\b/i,
    reply: (m, input, ctx) => {
      ctx.lastQuestion = "awaiting_support_person"; // Set penanda
      return choose([
        "Aku bisa merasakan kesedihanmu lewat kata-katamu. Aku di sini untuk membantumu, kira kira apa yang bisa membuatmu merasa lebih baik?",
        "Perasaan sedih kadang sulit diungkapkan. Aku di sini untuk mendukungmu, coba pikirkan apa yang bisa dilakukan untuk memperbaiki mood?",
      ]);
    }
  },
  {
    pattern: /\b(marah|kesal|jengkel|frustrasi)\b/i,
    reply: () =>
      choose([
        "Aku paham kamu sedang marah. Tapi coba deh tarik napas dalam-dalam dulu.",
        "Rasa marah itu wajar, tapi bisa melelahkan. Jadi coba untuk menenangkan diri dulu, ya",
        "Kesal banget ya rasanya. Apa yang menurutmu bisa bikin lebih lega?",
      ]),
  },
  {
    pattern: /\b(senang|bahagia|lega|gembira|puas)\b/i,
    reply: () =>
      choose([
        "Ikut senang dengarnya! Semangat terus yaa",
        "Bahagia itu berharga. Apa yang paling kamu syukuri saat ini?",
        "Wah, itu kabar baik! Apa yang ingin kamu rayakan dari perasaan ini?",
      ]),
  },
  {
    pattern: /\b(kenapa|mengapa) (.+?)\s*\??$/i,
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
    return {
      response: "Aku ada di sini kapan pun kamu siap untuk berbagi.",
      ctx,
    };
  }

  // Langkah 1: Periksa apakah ada konteks dari pertanyaan sebelumnya
  if (ctx.lastQuestion && CONTEXTUAL_RULES[ctx.lastQuestion]) {
    const rule = CONTEXTUAL_RULES[ctx.lastQuestion];
    const m = input.match(rule.pattern);

    if (m) {
      const response = rule.reply(m, input, ctx);
      // Hapus konteks setelah digunakan agar tidak terjebak
      delete ctx.lastQuestion;
      return { response, ctx };
    }
  }

  // Langkah 2: Jika tidak ada konteks, proses aturan seperti biasa
  for (const rule of RULES) {
    const m = input.match(rule.pattern);
    if (m) {
      const out = rule.reply(m, input, ctx);
      const response = Array.isArray(out) ? choose(out) : out;
      return { response, ctx };
    }
  }
  
  // Langkah 3: Fallback terakhir jika tidak ada aturan yang cocok sama sekali
  return { response: choose(FALLBACKS), ctx };
}

module.exports = { respond, reflect, RULES, FALLBACKS };
