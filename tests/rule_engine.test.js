import { respond, reflect } from "../src/rule_engine.js";

describe("pronoun reflection", () => {
  test("basic reflections", () => {
    expect(reflect("I am sad")).toBe("you are sad");
    expect(reflect("You are kind to me")).toBe("I are kind to you");
    expect(reflect("This is my book")).toBe("This is your book");
  });
});

describe("pattern: I need", () => {
  test("captures and reflects", () => {
    const r = respond("I need some help");
    expect(r.toLowerCase()).toContain("why do you feel you need");
  });
});

describe("pattern: I feel", () => {
  test("responds empathetically", () => {
    const r = respond("I feel anxious about exams").toLowerCase();
    expect(r.includes("feel") || r.includes("heavy")).toBe(true);
  });
});

describe("pattern: greeting", () => {
  test("hello triggers greeting", () => {
    const r = respond("hello");
    expect(r.toLowerCase()).toMatch(
      /how are you|what's on your mind|here to listen/
    );
  });
});

describe("fallback", () => {
  test("non-matching input still gets a response", () => {
    const r = respond("gibberish nonmatch 123");
    expect(typeof r).toBe("string");
    expect(r.length).toBeGreaterThan(0);
  });
});

describe("question mirror", () => {
  test("why do you works", () => {
    const r = respond("why do people ignore me?").toLowerCase();
    expect(r.startsWith("that's a thoughtful question")).toBe(true);
  });
});
