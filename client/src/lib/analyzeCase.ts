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
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    throw new Error("Unerwartetes Antwortformat von der KI.");
  }

  const result: AnalysisResult = JSON.parse(toolCall.function.arguments);
  result.isComplex = COMPLEX_TYPES.includes(result.problemType);
  return result;
}
