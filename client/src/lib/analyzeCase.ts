export type AnalysisResult = {
  product: string;
  title: string;
  summary: string;
  advice: string;
  nextStep: string;
};

export async function analyzeCase(input: string): Promise<AnalysisResult> {
  const text = input.toLowerCase();

  // 1. jugendamt_antworten
  if (text.includes("jugendamt") || text.includes("schreiben") || text.includes("antwort")) {
    return {
      product: "jugendamt_antworten",
      title: "Schreiben vom Jugendamt",
      summary: "Du hast ein Schreiben oder eine Aufforderung vom Jugendamt erhalten, die eingeordnet werden muss.",
      advice: "Prüfe zuerst Absender, Frist und konkrete Forderung, bevor du reagierst.",
      nextStep: "Lies das Schreiben Satz für Satz und markiere jede konkrete Aufforderung."
    };
  }

  // 2. durchsetzung
  if (text.includes("umgang") || text.includes("blockade") || text.includes("beschluss") || text.includes("kind nicht sehen")) {
    return {
      product: "durchsetzung",
      title: "Umgangs- oder Beschlussdurchsetzung",
      summary: "Es liegt eine Umgangsblockade oder ein nicht umgesetzter Beschluss vor.",
      advice: "Dokumentiere jede einzelne Verweigerung mit Datum, Uhrzeit und genauem Ablauf.",
      nextStep: "Prüfe, ob ein bestehender Beschluss vorliegt, und halte jede Abweichung schriftlich fest."
    };
  }

  // 3. gutachten
  if (text.includes("gutachten")) {
    return {
      product: "gutachten",
      title: "Gutachten-Situation",
      summary: "In deinem Fall spielt ein Gutachten eine zentrale Rolle.",
      advice: "Prüfe das Gutachten auf Widersprüche, fehlende Quellen und einseitige Bewertungen.",
      nextStep: "Gehe das Gutachten Absatz für Absatz durch und notiere jede fragwürdige Stelle."
    };
  }

  // 4. akteneinsicht
  if (text.includes("akte") || text.includes("akteneinsicht")) {
    return {
      product: "akteneinsicht",
      title: "Akteneinsicht",
      summary: "Du möchtest wissen, was über dich in der Akte steht oder wie du Einsicht bekommst.",
      advice: "Achte auf Vermerke, die du nicht kennst, und auf Formulierungen, die dich einseitig darstellen.",
      nextStep: "Beantrage schriftlich Akteneinsicht und dokumentiere, was du erhältst."
    };
  }

  // 5. protokollberichtigung
  if (text.includes("protokoll")) {
    return {
      product: "protokollberichtigung",
      title: "Protokollberichtigung",
      summary: "Ein Protokoll gibt deine Aussagen falsch oder unvollständig wieder.",
      advice: "Vergleiche das Protokoll Punkt für Punkt mit dem, was tatsächlich gesagt wurde.",
      nextStep: "Formuliere eine schriftliche Berichtigungsanforderung mit den konkreten Abweichungen."
    };
  }

  // 6. default → elternschutzpaket
  return {
    product: "elternschutzpaket",
    title: "Allgemeine Konfliktsituation",
    summary: "Dein Fall zeigt ein Konfliktmuster, das strukturiert eingeordnet werden muss.",
    advice: "Trenne Emotion von Fakten und arbeite mit klaren, belegbaren Aussagen.",
    nextStep: "Beschreibe den Fall genauer, damit eine präzisere Einordnung möglich wird."
  };
}
