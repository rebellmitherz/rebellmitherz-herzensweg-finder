import { useState } from "react";

type Step = "input" | "analysis" | "email" | "result";

const FALLBACK_RESULT = {
summary: "Deine Situation zeigt typische Konfliktmuster. Entscheidend ist jetzt Struktur statt Emotion.",
riskNote: "Unkontrollierte Reaktionen können später gegen dich verwendet werden.",
nextStep: "Arbeite zuerst mit klaren Fakten und dokumentiere alles sauber.",
};

export default function Fallcheck() {
const [step, setStep] = useState<Step>("input");
const [text, setText] = useState("");
const [email, setEmail] = useState("");

return (
<div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>

```
  {step === "input" && (
    <div>
      <h2>Was ist deine Situation?</h2>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Beschreibe deine Situation..."
        style={{ width: "100%", height: 150 }}
      />

      <button
        onClick={() => setStep("analysis")}
        style={{ marginTop: 20 }}
      >
        Auswerten
      </button>
    </div>
  )}

  {step === "analysis" && (
    <div>
      <h2>Analyse läuft...</h2>
      <p>Bitte kurz warten...</p>

      {setTimeout(() => setStep("email"), 1500) && null}
    </div>
  )}

  {step === "email" && (
    <div>
      <h2>Freischalten</h2>

      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail eingeben"
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={() => setStep("result")}
        style={{ marginTop: 20 }}
      >
        Freischalten
      </button>
    </div>
  )}

  {step === "result" && (
    <div>
      <h2>Deine Analyse</h2>

      <p>{FALLBACK_RESULT.summary}</p>
      <p>{FALLBACK_RESULT.riskNote}</p>
      <p>{FALLBACK_RESULT.nextStep}</p>

      <a
        href="https://www.rebellsystem.de/elternschutzpaket-produkt.html"
        target="_blank"
      >
        Zum Produkt
      </a>
    </div>
  )}
</div>
```

);
}
