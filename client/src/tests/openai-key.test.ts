import { describe, it, expect } from "vitest";

describe("OpenAI API Key validation", () => {
  it("VITE_OPENAI_API_KEY is defined and has correct format", () => {
    const key = process.env.VITE_OPENAI_API_KEY;
    expect(key).toBeDefined();
    expect(typeof key).toBe("string");
    expect((key as string).length).toBeGreaterThan(20);
    expect((key as string).startsWith("sk-")).toBe(true);
  });

  it("can reach OpenAI API with the key (models endpoint)", async () => {
    const key = process.env.VITE_OPENAI_API_KEY;
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: { Authorization: `Bearer ${key}` },
    });
    expect(response.status).toBe(200);
  }, 15000);
});
