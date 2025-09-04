// Impor fungsi yang akan diuji dari rule_engine.js Anda
const { respond, reflect } = require("../src/rule_engine.js");

// -- Tes untuk Fungsi `reflect` (Tidak Perlu Diubah) --
describe("Fungsi reflect (Refleksi Kata Ganti)", () => {
  test("1. Harus menukar kata ganti dasar (aku -> kamu)", () => {
    expect(reflect("aku butuh bantuan")).toBe("kamu butuh bantuan");
  });

  test("2. Harus menjaga kapitalisasi huruf pertama", () => {
    expect(reflect("Punyaku hilang")).toBe("Punyamu hilang");
  });

  test("3. Harus menukar kata ganti informal (gue -> lu)", () => {
    expect(reflect("menurut gue itu salah")).toBe("menurut lu itu salah");
  });

  test("4. Harus menangani kalimat tanpa kata ganti", () => {
    expect(reflect("ini adalah sebuah tes")).toBe("ini adalah sebuah tes");
  });
});

// -- Tes untuk Fungsi `respond` (Aturan Spesifik) --
// SEMUA TES DI BAWAH INI TELAH DIPERBARUI
describe("Fungsi respond (Aturan Spesifik)", () => {
  test("5. Harus merespons sapaan 'halo' dengan benar", () => {
    const result = respond("halo");
    const kemungkinanJawaban = [
      "Halo, apa kabar hatimu hari ini?",
      "Hai 👋 bagaimana perasaanmu saat ini?",
    ];
    // PERBAIKAN: Kita uji properti `.response` dari hasil object
    expect(kemungkinanJawaban).toContain(result.response);
  });
  
  test("5a. Harus merespons sapaan 'assalamualaikum' dengan benar", () => {
      const result = respond("assalamualaikum");
      const kemungkinanJawaban = [
          "Waalaikumussalam, aku senang bisa mendengarmu. Apa yang sedang kamu rasakan?",
      ];
      expect(kemungkinanJawaban).toContain(result.response);
  });


  test("6. Harus menangani pola 'aku butuh'", () => {
    const result = respond("aku butuh dukungan");
    // PERBAIKAN: Kita uji properti `.response`
    expect(result.response).toBe("Kenapa menurutmu kamu butuh dukungan?");
  });

  test("7. Harus menangani pola 'saya merasa'", () => {
    const result = respond("saya merasa sangat cemas");
    // PERBAIKAN: Kita uji properti `.response` dan panggil .toLowerCase() padanya
    expect(result.response.toLowerCase()).toContain("cemas");
  });

  test("8. Harus mengenali 'stres' dan mengatur konteks", () => {
    const result = respond("aku lagi stres");
    const kemungkinanJawaban = [
      "Kedengarannya melelahkan. apa yang paling bikin kamu merasa lelah?",
      "Capek itu wajar, tubuh dan hati butuh istirahat. Apa kamu sudah coba rehat sejenak?",
    ];
    // Uji respons teksnya
    expect(kemungkinanJawaban).toContain(result.response);
    // Uji apakah konteks diatur dengan benar
    expect(result.ctx.lastQuestion).toBe("awaiting_trigger");
  });

  test("8a. Harus mengenali 'sedih' dan mengatur konteks", () => {
    const result = respond("aku sedih");
    const kemungkinanJawaban = [
        "Aku bisa merasakan kesedihanmu lewat kata-katamu. Aku di sini untuk membantumu, kira kira apa yang bisa membuatmu merasa lebih baik?",
        "Perasaan sedih kadang sulit diungkapkan. Aku di sini untuk mendukungmu, coba pikirkan apa yang bisa dilakukan untuk memperbaiki mood?",
    ];
    expect(kemungkinanJawaban).toContain(result.response);
    expect(result.ctx.lastQuestion).toBe("awaiting_support_person");
  });

  test("9. Harus menangani pertanyaan 'kenapa'", () => {
    const result = respond("kenapa aku selalu gagal?");
    // PERBAIKAN: Kita uji properti `.response`
    expect(result.response).toBe(
      "Pertanyaan bagus. Menurutmu sendiri, kenapa kamu selalu gagal?"
    );
  });
});

// -- Tes untuk Kasus Khusus & Konteks --
describe("Fungsi respond (Kasus Khusus, Fallback & Konteks)", () => {
  test("10. Harus memberikan respons fallback (catch-all)", () => {
    const result = respond("kemarin cuaca sangat cerah sekali");
    // PERBAIKAN: Kita uji properti `.response` dengan toMatch
    expect(result.response).toMatch(/Saat kamu bilang|Kalau seorang temanmu mengalami|Apa yang kamu harapkan berubah dari/);
  });

  test("11. Harus memberikan respons untuk input kosong", () => {
    // PERBAIKAN: Kita uji properti `.response` untuk setiap kasus
    expect(respond("").response).toBe(
      "Aku ada di sini kapan pun kamu siap untuk berbagi."
    );
    expect(respond("   ").response).toBe(
      "Aku ada di sini kapan pun kamu siap untuk berbagi."
    );
  });
    
  test("12. Harus memberikan respons 'siapa kamu'", () => {
    const result = respond("kamu itu siapa sih");
    // PERBAIKAN: Kita uji properti `.response`
    expect(result.response).toBe(
      "Aku hanyalah chatbot pendengar, bukan terapis sungguhan, tapi aku akan berusaha memahami ceritamu."
    );
  });
  
  // -- BARU: Tes khusus untuk memvalidasi sistem konteks bekerja --
  test("13. Harus memberikan respons kontekstual setelah pertanyaan 'sedih'", () => {
      // Langkah 1: Picu pertanyaan yang mengatur konteks
      const initialResult = respond('aku merasa sangat sedih');
      expect(initialResult.ctx.lastQuestion).toBe('awaiting_support_person');

      // Langkah 2: Berikan jawaban dan PASS KONTEKS dari hasil sebelumnya
      const contextualResult = respond('melakukan hobiku', initialResult.ctx);
      
      // Uji apakah responsnya benar dan mengandung jawaban kita
      expect(contextualResult.response.toLowerCase()).toContain('aktivitas dengan melakukan hobiku');
      
      // Uji apakah konteks sudah dihapus setelah digunakan
      expect(contextualResult.ctx.lastQuestion).toBeUndefined();
  });
});