/**
 * analyzeCase.ts
 * Ruft die OpenAI API direkt aus dem Browser auf (gpt-4o-mini).
 * System-Prompt ist identisch mit der originalen Supabase Edge Function.
 */

export type AnalysisResult = {
  problemType: string;
  primaryProduct: string;
  secondaryProduct: string;
  summary: string;
  riskNote?: string;
  nextStep: string;
  detailBlocks?: { title: string; items: string[] }[];
  isComplex?: boolean;
};

type DetailBlock = { title: string; items: string[] };

type NormalizedProblemType =
  | "komplexe_situation"
  | "jugendamt_antworten"
  | "gespraech"
  | "durchsetzung"
  | "gutachten"
  | "akteneinsicht"
  | "protokollberichtigung";

const DETAIL_BLOCK_RULES: Record<NormalizedProblemType, { title: string; count: number }[]> = {
  gespraech: [
    { title: "Typische Fragen im Gespräch", count: 3 },
    { title: "So antwortest du stabil", count: 3 },
    { title: "Das solltest du vermeiden", count: 3 },
  ],
  jugendamt_antworten: [
    { title: "Was du zuerst prüfen solltest", count: 3 },
    { title: "Warum vorschnelle Reaktionen riskant sind", count: 1 },
  ],
  durchsetzung: [
    { title: "Was jetzt geprüft werden sollte", count: 3 },
    { title: "Warum Dokumentation jetzt entscheidend ist", count: 1 },
  ],
  gutachten: [
    { title: "Was du im Gutachten prüfen solltest", count: 3 },
    { title: "Worauf es bei der Bewertung ankommt", count: 1 },
  ],
  akteneinsicht: [
    { title: "Worauf du bei den Unterlagen achten solltest", count: 3 },
    { title: "Warum oberflächliches Lesen riskant ist", count: 1 },
  ],
  protokollberichtigung: [
    { title: "Häufige Fehler und Auslassungen in Protokollen", count: 3 },
    { title: "Warum Abweichungen nicht stehen bleiben sollten", count: 1 },
  ],
  komplexe_situation: [
    { title: "Was für die Einordnung deiner Lage entscheidend ist", count: 3 },
    { title: "Nächster sinnvoller Schritt", count: 1 },
  ],
};

const PROBLEM_TO_PRODUCT: Record<NormalizedProblemType, AnalysisResult["primaryProduct"]> = {
  durchsetzung: "durchsetzung",
  jugendamt_antworten: "jugendamt_antworten",
  gutachten: "gutachten",
  akteneinsicht: "akteneinsicht",
  protokollberichtigung: "protokollberichtigung",
  gespraech: "elternschutzpaket",
  komplexe_situation: "elternschutzpaket",
};

const PRIORITY_ORDER: NormalizedProblemType[] = [
  "durchsetzung",
  "jugendamt_antworten",
  "gutachten",
  "akteneinsicht",
  "protokollberichtigung",
  "gespraech",
  "komplexe_situation",
];

const KEYWORDS: Record<Exclude<NormalizedProblemType, "komplexe_situation">, string[]> = {
  durchsetzung: [
    "beschluss",
    "gerichtsbeschluss",
    "umgangsbeschluss",
    "nicht umgesetzt",
    "hält sich nicht daran",
    "haelt sich nicht daran",
    "umgang verweigert",
    "umgangsverweigerung",
    "vollstreck",
  ],
  jugendamt_antworten: [
    "schreiben",
    "brief",
    "bescheid",
    "aufforderung",
    "anhörung",
    "anhoerung",
    "stellungnahme",
    "frist",
  ],
  gutachten: ["gutachten", "gutachter", "begutachtung", "sachverständig", "sachverstaendig"],
  akteneinsicht: ["akteneinsicht", "akte", "aktenauszug", "vermerk", "vermerke", "unterlagen", "gespeichert"],
  protokollberichtigung: ["protokoll", "falsch protokolliert", "protokollberichtigung", "unvollständig", "unvollstaendig"],
  gespraech: ["gespräch", "gespraech", "jugendamt-gespräch", "jugendamt-gespraech", "termin vorbereiten", "typische fragen"],
};

const SYSTEM_PROMPT = `Du bist ein erfahrener Berater für Eltern in familienrechtlichen Konflikten (Jugendamt, Familiengericht, Gutachter, Verfahrensbeistand).

Der Nutzer hat als Vorauswahl ein Thema gewählt. Ignoriere diese Vorauswahl und klassifiziere eigenständig nach folgendem Prioritätsschema:

PRIORITÄTSREIHENFOLGE:

A. DURCHSETZUNG (höchste Priorität)
Wenn erwähnt: bestehender Beschluss, Gerichtsbeschluss, Umgangsbeschluss, "hält sich nicht daran", "Beschluss wird nicht umgesetzt", "es passiert nichts trotz Beschluss"
→ problemType = "durchsetzung", primaryProduct = "durchsetzung"

B. SCHREIBEN VERSTEHEN
Wenn hauptsächlich ein Brief, Bescheid, Aufforderung, Schreiben vom Jugendamt oder Familiengericht vorliegt, das verstanden oder beantwortet werden soll
→ problemType = "jugendamt_antworten", primaryProduct = "jugendamt_antworten"

C. GUTACHTEN
Wenn erwähnt: Gutachten, Gutachterfragen, Begutachtung, Sachverständiger
→ problemType = "gutachten", primaryProduct = "gutachten"

D. AKTENEINSICHT
Wenn erwähnt: Akteneinsicht, Akte, Berichte, Vermerke, E-Mails in der Akte, was über mich gespeichert wurde
→ problemType = "akteneinsicht", primaryProduct = "akteneinsicht"

E. PROTOKOLLBERICHTIGUNG
Wenn erwähnt: Protokoll falsch, Protokoll unvollständig, Aussage falsch protokolliert, Termin falsch wiedergegeben
→ problemType = "protokollberichtigung", primaryProduct = "protokollberichtigung"

F. GESPRÄCH VORBEREITEN
Wenn erwähnt: Jugendamt-Gespräch, Termin vorbereiten, typische Fragen, wie antworte ich im Gespräch
→ problemType = "gespraech", primaryProduct = "elternschutzpaket"

G. UNKLARE/KOMPLEXE GESAMTLAGE (niedrigste Priorität)
Wenn mehrere Themen vermischt und keine Kategorie klar dominiert
→ problemType = "komplexe_situation", primaryProduct = "elternschutzpaket"

secondaryProduct ist IMMER "elternschutzpaket".

AUFBAU DER AUSGABE:

Du lieferst drei inhaltliche Textfelder plus einen Mehrwertblock. Der Nutzer soll vor der Produktempfehlung echten Mehrwert erhalten.

1. "summary" – KURZE EINORDNUNG (2-4 Sätze)
Erkennbar fallbezogene Ersteinschätzung. Nicht einfach die Eingabe wiederholen. Sondern einordnen: Was liegt hier vor? Was ist die Konstellation? Was macht diese Lage relevant?

2. "riskNote" – RISIKO- UND DRUCKBLOCK (2-4 Sätze)
Seriös und sachlich vermitteln, warum diese Situation nicht banal ist. Risiken klar benennen. Folgen andeuten. Unsicherheit reduzieren. Subtilen Handlungsdruck erzeugen.
Formuliere so:
- "Das ist kein Detail, sondern ein Punkt mit möglicher Auswirkung."
- "Wenn das nicht sauber eingeordnet wird, entstehen schnell Nachteile."
- "Hier sollte nichts vorschnell passieren."
- "Die Konstellation spricht dafür, dass jetzt Struktur wichtiger ist als spontane Reaktion."
NICHT so:
- "Katastrophe", "extrem schlimm", "alles eskaliert", "sofort handeln sonst..."

3. "nextStep" – NÄCHSTER KONKRETER SCHRITT (1-2 Sätze)
Klar, konkret, umsetzbar.

4. "detailBlocks" – KONKRETER MEHRWERTBLOCK
Je nach erkanntem problemType liefere GENAU die folgenden Blöcke:

WENN problemType = "gespraech":
- Block 1: "Typische Fragen im Gespräch" (genau 3 realistische Fragen, die im Jugendamt-Gespräch gestellt werden)
- Block 2: "So antwortest du stabil" (genau 3 kurze, konkrete Hinweise für saubere Antworten)
- Block 3: "Das solltest du vermeiden" (genau 3 konkrete Fehler/Verhaltensweisen)

WENN problemType = "jugendamt_antworten":
- Block 1: "Was du zuerst prüfen solltest" (genau 3 Prüfpunkte: Frist, Absender, konkrete Forderung)
- Block 2: "Warum vorschnelle Reaktionen riskant sind" (genau 1 kurzer, konkreter Absatz – KEIN Array, sondern ein einzelner String als einziges Item)

WENN problemType = "durchsetzung":
- Block 1: "Was jetzt geprüft werden sollte" (genau 3 konkrete Prüfpunkte zum Beschluss)
- Block 2: "Warum Dokumentation jetzt entscheidend ist" (genau 1 kurzer Absatz als einzelnes Item)

WENN problemType = "gutachten":
- Block 1: "Was du im Gutachten prüfen solltest" (genau 3 Prüfpunkte)
- Block 2: "Worauf es bei der Bewertung ankommt" (genau 1 kurzer Absatz als einzelnes Item zu Widersprüchen, Lücken, problematischen Bewertungen)

WENN problemType = "akteneinsicht":
- Block 1: "Worauf du bei den Unterlagen achten solltest" (genau 3 Punkte)
- Block 2: "Warum oberflächliches Lesen riskant ist" (genau 1 kurzer Absatz als einzelnes Item)

WENN problemType = "protokollberichtigung":
- Block 1: "Häufige Fehler und Auslassungen in Protokollen" (genau 3 Punkte)
- Block 2: "Warum Abweichungen nicht stehen bleiben sollten" (genau 1 kurzer Absatz als einzelnes Item)

WENN problemType = "komplexe_situation":
- Block 1: "Was für die Einordnung deiner Lage entscheidend ist" (genau 3 Punkte)
- Block 2: "Nächster sinnvoller Schritt" (genau 1 kurzer Absatz als einzelnes Item)

WICHTIGE REGELN FÜR ALLE TEXTE:
- Schreibe klar, direkt und verständlich.
- Kein juristisches Fachchinesisch.
- Konkrete, situationsbezogene Hinweise statt generischer Phrasen.
- Vermeide Aussagen wie "Holen Sie sich rechtliche Hilfe", "Lassen Sie sich beraten", "Bleiben Sie ruhig".
- Jeder Text muss zur konkreten Eingabe des Nutzers passen – nicht generisch klingen.
- Variiere die Formulierungen, damit die Ausgabe nicht jedes Mal gleich klingt.
- Der Nutzer soll nach dem Lesen denken: "Ich habe schon jetzt etwas Brauchbares bekommen."
- Der Ton ist: sachlich, klar, ernst, vertrauenswürdig, spürbar dringlich.
- NICHT: panisch, reißerisch, marktschreierisch, übertrieben emotional.

Antworte auf Deutsch. Antworte AUSSCHLIESSLICH mit einem JSON-Objekt, kein Markdown, keine Erklärungen.`;

const TOOLS = [
  {
    type: "function",
    function: {
      name: "provide_analysis",
      description: "Return a structured analysis with classification, risk assessment, and actionable content blocks.",
      parameters: {
        type: "object",
        properties: {
          problemType: {
            type: "string",
            enum: ["komplexe_situation", "jugendamt_antworten", "gespraech", "durchsetzung", "gutachten", "akteneinsicht", "protokollberichtigung"],
          },
          primaryProduct: {
            type: "string",
            enum: ["jugendamt_antworten", "gutachten", "akteneinsicht", "protokollberichtigung", "durchsetzung", "elternschutzpaket"],
          },
          secondaryProduct: {
            type: "string",
            enum: ["jugendamt_antworten", "gutachten", "akteneinsicht", "protokollberichtigung", "durchsetzung", "elternschutzpaket"],
          },
          summary: { type: "string" },
          riskNote: { type: "string" },
          nextStep: { type: "string" },
          detailBlocks: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                items: { type: "array", items: { type: "string" } },
              },
              required: ["title", "items"],
            },
          },
        },
        required: ["problemType", "primaryProduct", "secondaryProduct", "summary", "riskNote", "nextStep", "detailBlocks"],
        additionalProperties: false,
      },
    },
  },
];

const COMPLEX_TYPES = ["komplexe_situation", "durchsetzung", "gutachten"];

export function classifyByPriority(input: string): NormalizedProblemType {
  const text = input.toLowerCase();

  const matchedTypes = PRIORITY_ORDER.filter((type) => {
    if (type === "komplexe_situation") return false;
    return KEYWORDS[type].some((keyword) => text.includes(keyword));
  });

  if (matchedTypes.length === 0) {
    return "komplexe_situation";
  }

  return matchedTypes[0];
}

function chooseByPriority(a: NormalizedProblemType, b: NormalizedProblemType): NormalizedProblemType {
  return PRIORITY_ORDER.indexOf(a) <= PRIORITY_ORDER.indexOf(b) ? a : b;
}

function normalizeDetailBlocks(problemType: NormalizedProblemType, detailBlocks?: { title: string; items: string[] }[]): DetailBlock[] {
  const rules = DETAIL_BLOCK_RULES[problemType];
  return rules.map((rule, index) => {
    const source = detailBlocks?.[index];
    const items = Array.isArray(source?.items) ? source.items : [];
    const sanitized = items
      .map((item) => (typeof item === "string" ? item.trim() : ""))
      .filter(Boolean)
      .slice(0, rule.count);

    while (sanitized.length < rule.count) {
      sanitized.push("Konkrete Details wurden von der Analyse nicht vollständig geliefert – bitte Falltext ergänzen.");
    }

    return {
      title: rule.title,
      items: sanitized,
    };
  });
}

function normalizeResult(raw: Partial<AnalysisResult>, userText: string): AnalysisResult {
  const fallbackProblemType = classifyByPriority(userText);
  const rawType = raw.problemType as NormalizedProblemType | undefined;
  const modelType = rawType && DETAIL_BLOCK_RULES[rawType] ? rawType : "komplexe_situation";
  const normalizedType = chooseByPriority(modelType, fallbackProblemType);

  return {
    problemType: normalizedType,
    primaryProduct: PROBLEM_TO_PRODUCT[normalizedType],
    secondaryProduct: "elternschutzpaket",
    summary: raw.summary?.trim() || "Deine Angaben zeigen eine konfliktbelastete Situation, die strukturiert eingeordnet werden muss.",
    riskNote: raw.riskNote?.trim() || "Das ist kein Detail, sondern ein Punkt mit möglicher Auswirkung. Wenn das nicht sauber eingeordnet wird, entstehen schnell Nachteile.",
    nextStep: raw.nextStep?.trim() || "Lege zuerst alle relevanten Unterlagen und Fristen in einer Liste zusammen und priorisiere den nächsten Schritt.",
    detailBlocks: normalizeDetailBlocks(normalizedType, raw.detailBlocks),
    isComplex: COMPLEX_TYPES.includes(normalizedType),
  };
}

export async function analyzeCase(
  userText: string,
  topicId: string
): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API Key nicht konfiguriert.");

  const userMessage = `Thema-Vorauswahl: ${topicId}\n\nNutzer-Eingabe:\n${userText}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
      tools: TOOLS,
      tool_choice: { type: "function", function: { name: "provide_analysis" } },
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Zu viele Anfragen. Bitte versuche es in einer Minute erneut.");
    }
    throw new Error("Analyse konnte nicht durchgeführt werden. Bitte versuche es erneut.");
  }

  const data = await response.json();
  const message = data.choices?.[0]?.message;
  const toolCall = message?.tool_calls?.[0];

  let parsed: Partial<AnalysisResult> | null = null;

  if (toolCall?.function?.arguments) {
    try {
      parsed = JSON.parse(toolCall.function.arguments) as Partial<AnalysisResult>;
    } catch {
      parsed = null;
    }
  }

  if (!parsed && typeof message?.content === "string" && message.content.trim().startsWith("{")) {
    try {
      parsed = JSON.parse(message.content) as Partial<AnalysisResult>;
    } catch {
      parsed = null;
    }
  }

  if (!parsed) {
    throw new Error("Unerwartetes Antwortformat von der KI.");
  }

  return normalizeResult(parsed, userText);
}