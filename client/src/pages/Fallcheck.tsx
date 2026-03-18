import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Upload, X, FileText, Calendar, CheckCircle, AlertTriangle, Lightbulb, ExternalLink, Lock } from "lucide-react";

type FunnelStep = "input" | "analysis" | "email-gate" | "result";

const PRODUCT_MAP = {
  elternschutzpaket: {
    title: "Elternschutzpaket",
    href: "https://www.rebellsystem.de/elternschutzpaket-produkt.html",
    description: "Vorlagen, Struktur und klare nächste Schritte.",
  },
};

const FALLBACK_RESULT = {
  problemType: "komplexe_situation",
  primaryProduct: "elternschutzpaket",
  secondaryProduct: "elternschutzpaket",
  isComplex: true,
  summary:
    "Deine Situation zeigt typische Konfliktmuster. Das Problem ist nicht nur das Ereignis selbst, sondern wie darauf reagiert wird.",
  riskNote:
    "Unstrukturierte Reaktionen führen oft dazu, dass du später schlechter dastehst, obwohl du im Kern recht hast.",
  nextStep:
    "Ordne zuerst sauber: Was ist passiert, was ist belegt, was ist deine konkrete Zielrichtung.",
  detailBlocks: [
    {
      title: "Was jetzt entscheidend ist",
      items: [
        "Trenne Emotion von Fakten",
        "Arbeite mit klaren Aussagen statt langen Texten",
        "Dokumentiere alles sauber",
      ],
    },
    {
      title: "Nächster sinnvoller Schritt",
      items: ["Struktur aufbauen, bevor du reagierst"],
    },
  ],
};

function StepInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <h2>Was ist deine Situation?</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Beschreibe deine Situation"
        style={{ width: "100%", height: 150 }}
      />

      <button onClick={() => fileRef.current?.click()}>Dokument hochladen</button>
      <input ref={fileRef} type="file" className="hidden" />

      <button onClick={() => onSubmit(text)}>Auswerten</button>
    </div>
  );
}

function StepAnalysis({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    setTimeout(onComplete, 1500);
  }, [onComplete]);

  return <div>Analyse läuft...</div>;
}

function StepEmailGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <div>
      <h3>Freischalten</h3>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="E-Mail"
        style={{ width: "100%", padding: 10 }}
      />

      <button onClick={onUnlock}>Freischalten</button>
    </div>
  );
}

function StepResult({ result }: { result: typeof FALLBACK_RESULT }) {
  return (
    <div>
      <h2>Deine Analyse</h2>
      <p>{result.summary}</p>
      <p>{result.riskNote}</p>
      <p>{result.nextStep}</p>

      <a href={PRODUCT_MAP.elternschutzpaket.href}>Zum Produkt</a>
    </div>
  );
}

export default function Fallcheck() {
  const [navigate] = useLocation();
  const [step, setStep] = useState<FunnelStep>("input");
  const [result, setResult] = useState<any>(null);

  const handleInput = (text: string) => {
    setStep("analysis");
    setTimeout(() => {
      setResult(FALLBACK_RESULT);
      setStep("email-gate");
    }, 1000);
  };

  return (
    <div style={{ padding: 20 }}>
      {step === "input" && <StepInput onSubmit={handleInput} />}
      {step === "analysis" && <StepAnalysis onComplete={() => setStep("email-gate")} />}
      {step === "email-gate" && <StepEmailGate onUnlock={() => setStep("result")} />}
      {step === "result" && result && <StepResult result={result} />}
    </div>
  );
}
