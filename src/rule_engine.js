/**
 * Rule-based "therapist-style" engine with regex patterns and pronoun reflection.
 * Inspired by ELIZA, but more empathetic.
 * Created by Johan and Fajrul.
 */

// Pronoun reflection map
const REFLECTIONS = new Map([
  ["i", "you"],
  ["me", "you"],
  ["my", "your"],
  ["mine", "yours"],
  ["am", "are"],
  ["myself", "yourself"],
  ["you", "I"],
  ["your", "my"],
  ["yours", "mine"],
  ["yourself", "myself"],
  ["i'm", "you're"],
  ["i’ve", "you’ve"],
  ["i'd", "you'd"],
  ["i'll", "you'll"],
  ["we", "you"],
  ["our", "your"],
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
  "I hear you. Can you tell me more about that?",
  "That sounds important. What do you feel is the hardest part right now?",
  "I'm listening. When did you start feeling this way?",
  "Thanks for sharing that. What would help, even a little, in this moment?",
];

// Rule table
const RULES = [
  {
    pattern: /\b(?:hello|hi|hey|halo|hai)\b/i,
    reply: () =>
      choose([
        "Hi there 👋 How are you feeling today?",
        "Hello. What's on your mind right now?",
        "Hey, I'm here to listen. How are you doing?",
      ]),
  },
  {
    pattern: /\bi need (.+)/i,
    reply: (m) => `Why do you feel you need ${reflect(m[1])}?`,
  },
  {
    pattern: /\bi feel (.+)/i,
    reply: (m) =>
      choose([
        `It makes sense to feel ${reflect(
          m[1]
        )}. What do you think is driving that feeling?`,
        `Feeling ${reflect(
          m[1]
        )} can be heavy. What happened recently that might relate to this?`,
      ]),
  },
  {
    pattern: /\b(?:i am|i'm)\s+(.+)/i,
    reply: (m) =>
      choose([
        `Thanks for sharing that you're ${reflect(
          m[1]
        )}. What do you need right now?`,
        `Being ${reflect(
          m[1]
        )} can be tough. What tends to help when you feel this way?`,
      ]),
  },
  {
    pattern: /\bbecause (.+)/i,
    reply: (m) =>
      `That reason matters. If ${reflect(m[1])}, what does that mean for you?`,
  },
  {
    pattern: /\b(?:who are you|what are you|are you (?:a )?therapist)\b/i,
    reply: () =>
      "I'm a supportive chatbot—not a licensed therapist—but I'm here to listen and reflect with you.",
  },
  {
    pattern: /\b(stress(ed)?|anxious|anxiety|cemas|gelisah)\b/i,
    reply: () =>
      choose([
        "Anxiety can feel overwhelming. Would a brief breathing exercise help right now?",
        "Feeling stressed is understandable. What's the biggest source of pressure at the moment?",
      ]),
  },
  {
    pattern: /\b(sad|sedih|down|depress(ed)?|murung)\b/i,
    reply: () =>
      choose([
        "I'm sorry you're feeling low. What support has helped you before in times like this?",
        "That sounds really heavy. If it's okay, what led up to these feelings?",
      ]),
  },
  {
    pattern: /\b(angry|marah|kesal|frustrated)\b/i,
    reply: () =>
      choose([
        "It sounds frustrating. What triggered the anger?",
        "Those feelings are valid. What outcome would feel fair to you?",
      ]),
  },
  {
    pattern: /\bwhy (?:do|did|am|are|is|would|should)\b(.+)/i,
    reply: (m) => `That's a thoughtful question. What do you think—why${m[1]}?`,
  },
  {
    pattern: /(.+)/i,
    reply: (m) =>
      choose([
        `When you say "${reflect(m[1])}", what stands out the most to you?`,
        `What do you hope will change about "${reflect(m[1])}"?`,
        `If a close friend felt this about "${reflect(
          m[1]
        )}", what would you say to them?`,
      ]),
  },
];

export function respond(input, ctx = {}) {
  if (!input || !input.trim()) {
    return "I'm here whenever you're ready to share.";
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

export { reflect, RULES };
