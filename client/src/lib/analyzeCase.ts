export async function analyzeCase(input: string) {
  const text = input.toLowerCase();
  if (text.includes("jugendamt")) {
    return {
      title: "Problem mit Jugendamt",
      summary: "Dein Fall zeigt typische Konflikte mit dem Jugendamt.",
      advice: "Bleib ruhig, dokumentiere alles und arbeite strukturiert.",
      nextStep: "Sichere alle Beweise und bereite eine klare Stellungnahme vor."
    };
  }
  if (text.includes("umgang") || text.includes("kind sehen")) {
    return {
      title: "Umgangsproblem",
      summary: "Es liegt vermutlich eine Umgangsblockade vor.",
      advice: "Reagiere nicht emotional. Bleib sachlich.",
      nextStep: "Dokumentiere jede Verweigerung exakt."
    };
  }
  if (text.includes("gericht")) {
    return {
      title: "Gerichtliche Situation",
      summary: "Dein Fall ist bereits auf gerichtlicher Ebene.",
      advice: "Hier zählt Klarheit und Beweisführung.",
      nextStep: "Bereite deine Aussagen strukturiert vor."
    };
  }
  return {
    title: "Unklare Situation",
    summary: "Dein Fall zeigt ein allgemeines Konfliktmuster.",
    advice: "Struktur statt Emotion.",
    nextStep: "Beschreibe den Fall genauer für bessere Analyse."
  };
}
