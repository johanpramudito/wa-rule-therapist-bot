const { respond, reflect, FALLBACKS, RULES } = require("../src/rule_engine.js");

// -- Kumpulan Tes untuk Fungsi `reflect` --
describe("Fungsi reflect (Refleksi Kata Ganti)", () => {
  test("1. Harus menukar kata ganti dasar (aku -> kamu)", () => {
    expect(reflect("aku butuh bantuan")).toBe("kamu butuh bantuan");
  });

  test("2. Harus menjaga kapitalisasi huruf pertama", () => {
    expect(reflect("Punyaku hilang")).toBe("Punyamu hilang");
    expect(reflect("Diriku merasa lelah")).toBe("Dirimu merasa lelah");
  });

  test("3. Harus menukar kata ganti informal (gue -> lu)", () => {
    expect(reflect("menurut gue itu salah")).toBe("menurut lu itu salah");
  });

  test("4. Harus menangani kalimat tanpa kata ganti yang perlu direfleksi", () => {
    expect(reflect("ini adalah sebuah tes")).toBe("ini adalah sebuah tes");
  });
});

// -- Kumpulan Tes untuk Fungsi `respond` (Aturan & Pola) --
describe("Fungsi respond (Aturan Spesifik)", () => {
  test("5. Harus merespons sapaan dengan benar", () => {
    const sapaan = respond("halo");
    const kemungkinanJawaban = [
      "Halo, apa kabar hatimu hari ini?",
      "Hai 👋 bagaimana perasaanmu saat ini?",
      "Waalaikumussalam, aku senang bisa mendengarmu. Apa yang sedang kamu rasakan?",
    ];
    // Memastikan respons adalah salah satu dari kemungkinan jawaban sapaan
    expect(kemungkinanJawaban).toContain(sapaan);
  });

  test("6. Harus menangani pola 'aku butuh' dan merefleksikan objeknya", () => {
    const respons = respond("aku butuh dukungan darimu");
    // Ekspektasi: "Kenapa menurutmu kamu butuh dukungan dari saya?"
    expect(respons).toContain("Kenapa menurutmu kamu butuh");
    expect(respons).toContain("dukungan dariku?");
  });

  test("7. Harus menangani pola 'saya merasa' dan merespons dengan empati", () => {
    const respons = respond("saya merasa sangat cemas");
    // Respons bisa random, jadi kita cek apakah mengandung bagian penting
    expect(respons.toLowerCase()).toContain("sangat cemas");
  });

  test("8. Harus mengenali kata kunci emosi seperti 'stres' atau 'lelah'", () => {
    const respons = respond("Akhir-akhir ini aku sering stres");
    const kemungkinanJawaban = [
      "Kedengarannya melelahkan. Apa yang paling bikin kamu merasa tertekan?",
      "Capek itu wajar, tubuh dan hati butuh istirahat. Apa kamu sudah coba rehat sejenak?",
    ];
    expect(kemungkinanJawaban).toContain(respons);
  });

  test("9. Harus menangani pertanyaan 'kenapa' dan membalikkannya", () => {
    const respons = respond("kenapa aku selalu gagal?");
    // Ekspektasi: "Pertanyaan bagus. Menurutmu sendiri, kenapa kamu selalu gagal?"
    expect(respons).toBe("Pertanyaan bagus. Menurutmu sendiri, kenapa kamu selalu gagal?");
  });
});

// -- Kumpulan Tes untuk Kasus Khusus & Fallback --
describe("Fungsi respond (Kasus Khusus & Fallback)", () => {
  test("10. Harus memberikan respons fallback jika tidak ada aturan yang cocok", () => {
    const respons = respond("kemarin cuaca sangat cerah sekali");
    // Respons harus salah satu dari array FALLBACKS
    // Kita tidak bisa mengetes ini secara langsung karena ada aturan catch-all `(.+)`
    // Jadi kita tes aturan catch-all tersebut.
    expect(respons).toMatch(/Saat kamu bilang|Kalau seorang temanmu mengalami|Apa yang kamu harapkan berubah dari/);
  });

  test("11. Harus memberikan respons untuk input kosong atau spasi", () => {
    expect(respond("")).toBe("Aku ada di sini kapan pun kamu siap untuk berbagi.");
    expect(respond("   ")).toBe("Aku ada di sini kapan pun kamu siap untuk berbagi.");
    expect(respond(null)).toBe("Aku ada di sini kapan pun kamu siap untuk berbagi.");
  });
    
  test("12. Harus memberikan respons 'siapa kamu' dengan benar", () => {
    const respons = respond("kamu itu siapa sih");
    expect(respons).toBe("Aku hanyalah chatbot pendengar, bukan terapis sungguhan, tapi aku akan berusaha memahami ceritamu.");
  });
});