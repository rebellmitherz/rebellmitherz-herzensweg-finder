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
      summary: "Deine Situation erfordert eine formelle und strategische Reaktion auf ein Schreiben. Das Jugendamt dokumentiert jede deiner Aussagen, weshalb spontane oder emotionale Antworten oft gegen dich verwendet werden. Es geht jetzt darum, den Sachverhalt nüchtern zu klären, ohne unnötige Angriffsfläche zu bieten.",
      advice: "Risiko: Wenn du Fristen verpasst oder dich in Rechtfertigungen verlierst, schaffst du Fakten, die später schwer zu korrigieren sind. Typischer Fehler: Ein langer, emotionaler Brief, der mehr Fragen aufwirft als beantwortet.",
      nextStep: "1. Prüfe das Schreiben auf konkrete Fristen und Forderungen.\n2. Trenne Vorwürfe von echten Fakten.\n3. Formuliere eine knappe, sachliche Antwort ohne emotionale Zusätze.\nWarum das wichtig ist: Nur eine strukturierte Antwort schützt dich vor weiteren Eskalationen."
    };
  }

  // 2. durchsetzung
  if (text.includes("umgang") || text.includes("blockade") || text.includes("beschluss") || text.includes("kind nicht sehen")) {
    return {
      product: "durchsetzung",
      title: "Umgangs- oder Beschlussdurchsetzung",
      summary: "Es liegt eine klare Blockadehaltung oder die Missachtung eines Beschlusses vor. Solche Situationen eskalieren schnell, wenn sie nicht konsequent und rechtssicher dokumentiert werden. Dein Fokus muss jetzt auf der Schaffung von unwiderlegbaren Beweisen liegen.",
      advice: "Risiko: Ohne lückenlose Dokumentation steht Aussage gegen Aussage, was vor Gericht oft zu deinen Ungunsten ausgelegt wird. Typischer Fehler: Mündliche Diskussionen an der Haustür statt schriftlicher Fixierung der Verweigerung.",
      nextStep: "1. Dokumentiere jede Verweigerung mit Datum, Uhrzeit und Zeugen.\n2. Fordere den Umgang immer schriftlich und nachweisbar ein.\n3. Stelle bei wiederholter Missachtung eines Beschlusses einen Ordnungsgeldantrag.\nWarum das wichtig ist: Gerichte handeln nur auf Basis von harten, belegbaren Fakten."
    };
  }

  // 3. gutachten
  if (text.includes("gutachten")) {
    return {
      product: "gutachten",
      title: "Gutachten-Situation",
      summary: "Ein Gutachten ist oft weichenstellend für das gesamte Verfahren. Viele Gutachten weisen jedoch methodische Mängel, unzulässige Schlussfolgerungen oder einseitige Bewertungen auf. Es ist entscheidend, diese Schwachstellen systematisch aufzudecken.",
      advice: "Risiko: Ein unwidersprochenes Gutachten wird vom Gericht fast immer als Tatsache übernommen. Typischer Fehler: Das Gutachten nur pauschal als 'falsch' abzulehnen, statt methodische Fehler konkret zu benennen.",
      nextStep: "1. Lies das Gutachten mehrfach und markiere alle Widersprüche.\n2. Prüfe, ob Tatsachenbehauptungen mit echten Quellen belegt sind.\n3. Formuliere gezielte Ergänzungsfragen an den Gutachter.\nWarum das wichtig ist: Nur durch methodische Kritik kannst du die Glaubwürdigkeit des Gutachtens erschüttern."
    };
  }

  // 4. akteneinsicht
  if (text.includes("akte") || text.includes("akteneinsicht")) {
    return {
      product: "akteneinsicht",
      title: "Akteneinsicht",
      summary: "In deiner Akte befinden sich Vermerke, Berichte und Einschätzungen, die deine Position maßgeblich beeinflussen. Oft stehen dort Dinge, von denen du nichts weißt oder die einseitig dargestellt sind. Du musst genau wissen, was über dich gespeichert ist.",
      advice: "Risiko: Unbekannte negative Vermerke können in zukünftigen Entscheidungen plötzlich gegen dich verwendet werden. Typischer Fehler: Darauf zu vertrauen, dass die Akte schon 'stimmen wird', ohne sie selbst geprüft zu haben.",
      nextStep: "1. Beantrage formell und schriftlich die vollständige Akteneinsicht.\n2. Prüfe jeden Vermerk auf Richtigkeit und Vollständigkeit.\n3. Fordere bei falschen Tatsachenbehauptungen sofort eine Gegendarstellung zur Akte.\nWarum das wichtig ist: Wer seine Akte nicht kennt, kämpft im Blindflug."
    };
  }

  // 5. protokollberichtigung
  if (text.includes("protokoll")) {
    return {
      product: "protokollberichtigung",
      title: "Protokollberichtigung",
      summary: "Ein fehlerhaftes oder unvollständiges Protokoll verfälscht den tatsächlichen Verlauf eines Gesprächs oder einer Verhandlung. Was im Protokoll steht, gilt später als bewiesen. Du musst Abweichungen sofort und formgerecht korrigieren lassen.",
      advice: "Risiko: Wenn du ein falsches Protokoll unwidersprochen lässt, stimmst du dem Inhalt juristisch zu. Typischer Fehler: Die Frist zur Protokollberichtigung verstreichen zu lassen, weil man den Fehler für 'nicht so schlimm' hält.",
      nextStep: "1. Vergleiche das Protokoll sofort nach Erhalt mit deinen eigenen Notizen.\n2. Notiere exakt, was gesagt wurde und was im Protokoll fehlt oder falsch ist.\n3. Reiche innerhalb der Frist einen formellen Antrag auf Protokollberichtigung ein.\nWarum das wichtig ist: Das Protokoll ist die einzige Wahrheit, die für das weitere Verfahren zählt."
    };
  }

  // 6. default → elternschutzpaket
  return {
    product: "elternschutzpaket",
    title: "Allgemeine Konfliktsituation",
    summary: "Deine Situation zeigt ein komplexes Konfliktmuster, das schnell unübersichtlich werden kann. In solchen Phasen ist es entscheidend, die Kontrolle zu behalten und nicht auf jede Provokation zu reagieren. Du brauchst jetzt eine klare, strategische Linie.",
    advice: "Risiko: Emotionale Reaktionen und unstrukturierte Kommunikation bieten der Gegenseite Munition. Typischer Fehler: Sich in endlosen Diskussionen zu verlieren, statt klare Grenzen zu ziehen.",
    nextStep: "1. Reduziere die Kommunikation auf das absolut Notwendige und Schriftliche.\n2. Beginne sofort mit einer lückenlosen, sachlichen Dokumentation aller Vorfälle.\n3. Ordne deine Unterlagen und erstelle einen klaren Zeitstrahl der Ereignisse.\nWarum das wichtig ist: Struktur und Fakten sind dein stärkster Schutz gegen emotionale Vorwürfe."
  };
}
