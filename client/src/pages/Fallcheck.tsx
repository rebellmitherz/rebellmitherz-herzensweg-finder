import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Upload, X, FileText, Calendar, CheckCircle, AlertTriangle, Lightbulb, ExternalLink, Lock } from "lucide-react";
import { analyzeCase } from "../lib/analyzeCase";

type FunnelStep = "input" | "analysis" | "preview" | "email-gate" | "email-loading" | "result";

const PRODUCT_MAP: Record<string, { title: string; href: string; description: string }> = {
  jugendamt_antworten: {
    title: "Sichere Jugendamt-Antwort",
    href: "https://www.rebellsystem.de/jugendamt-antworten-produkt.html",
    description: "Schreiben verstehen, sicher reagieren.",
  },
  durchsetzung: {
    title: "Durchsetzungspaket",
    href: "https://www.rebellsystem.de/durchsetzung-produkt.html",
    description: "Umgang durchsetzen, Beschlüsse einfordern.",
  },
  gutachten: {
    title: "Gutachten-Check",
    href: "https://www.rebellsystem.de/gutachten-produkt.html",
    description: "Gutachten prüfen, Schwachstellen finden.",
  },
  akteneinsicht: {
    title: "Akteneinsicht-Paket",
    href: "https://www.rebellsystem.de/akteneinsicht-produkt.html",
    description: "Akten verstehen, Fehler erkennen.",
  },
  protokollberichtigung: {
    title: "Protokollberichtigung",
    href: "https://www.rebellsystem.de/protokollberichtigung-produkt.html",
    description: "Falsche Protokolle korrigieren lassen.",
  },
  elternschutzpaket: {
    title: "Elternschutzpaket",
    href: "https://www.rebellsystem.de/elternschutzpaket-produkt.html",
    description: "Vorlagen, Struktur und klare nächste Schritte.",
  },
};

function StepInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Was ist deine Situation?</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Beschreibe deine Situation so genau wie möglich..."
        className="w-full p-4 border rounded-lg mb-4 min-h-[200px] focus:ring-2 focus:ring-blue-500 outline-none"
        style={{ width: "100%" }}
      />

      <div className="flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => fileRef.current?.click()}
          className="flex items-center justify-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Upload size={18} /> Dokument hochladen
        </button>
        <input ref={fileRef} type="file" className="hidden" />

        <button 
          onClick={() => onSubmit(text)}
          disabled={!text.trim()}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Auswerten <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function StepAnalysis({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="text-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold">Analyse läuft...</h2>
      <p className="text-gray-500">Wir werten deine Angaben basierend auf aktuellen Mustern aus.</p>
    </div>
  );
}

function StepPreview({ result, onContinue }: { result: any; onContinue: () => void }) {
  // First 2 sentences only
  const summaryTeaser = result.summary.split(".").slice(0, 2).join(".").trim() + ".";
  // First risk line only
  const riskTeaser = result.advice.split("\n")[0];
  // First action step only (incomplete)
  const firstStep = result.nextStep.split("\n").filter((l: string) => l.trim())[0] || "";

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Title + short explanation */}
      <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <CheckCircle size={22} />
          <h2 className="text-lg font-bold">{result.title || "Erste Einschätzung"}</h2>
        </div>
        <p className="text-gray-800 text-sm leading-relaxed">{summaryTeaser}</p>
      </div>

      {/* 1 risk block */}
      <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
        <div className="flex items-center gap-2 text-amber-700 mb-1">
          <AlertTriangle size={18} />
          <span className="font-bold text-sm">Risiko</span>
        </div>
        <p className="text-gray-700 text-sm font-medium">Typischer Fehler:</p>
        <p className="text-gray-700 text-sm mt-1">Ein unkontrollierter oder emotionaler Brief kann dazu führen, dass deine Aussagen später gegen dich verwendet werden und sich deine Situation dauerhaft verschlechtert.</p>
      </div>

      {/* Only 1 step visible, rest locked */}
      <div className="bg-white p-4 rounded-xl border shadow-sm">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2 text-gray-700">
          <Lightbulb size={16} /> Nächste Schritte
        </h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2 text-gray-700">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">1</span>
            {firstStep.replace(/^\d+\.\s*/, "")}
          </li>
          <li className="flex items-center gap-2 text-gray-400">
            <Lock size={14} className="shrink-0" />
            <span className="italic">Weitere konkrete Schritte gesperrt</span>
          </li>
        </ul>
      </div>

      {/* Curiosity block */}
      <div className="border border-orange-200 bg-orange-50 rounded-xl p-4">
        <p className="text-orange-800 text-sm font-medium leading-relaxed">
          ⚠️ In genau solchen Fällen wird häufig ein Fehler gemacht,
          der später vor Gericht gegen dich verwendet wird.
        </p>
        <p className="text-orange-700 text-sm mt-1">→ Wird dir nach Freischaltung konkret gezeigt.</p>
      </div>

      {/* Unlock CTA */}
      <button
        onClick={onContinue}
        className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-base"
      >
        Jetzt Analyse sichern &amp; Fehler vermeiden →
      </button>
      <p className="text-center text-xs text-gray-400 mt-2">
        ✓ dauert nur 10 Sekunden &nbsp;&nbsp; ✓ sofort konkrete Schritte
      </p>
    </div>
  );
}

function StepEmailGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="bg-blue-50 p-6 rounded-xl mb-6">
        <Lock className="mx-auto text-blue-600 mb-3" size={32} />
        <h3 className="text-xl font-bold mb-2">Analyse bereit</h3>
        <p className="text-gray-600">Gib deine E-Mail-Adresse ein, um die vollständige Auswertung freizuschalten.</p>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Deine E-Mail-Adresse"
        className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button 
        onClick={onUnlock}
        disabled={!email.includes("@")}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        Jetzt kostenlos freischalten
      </button>
    </div>
  );
}

function StepEmailLoading({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Analysiere deine Situation…",
    "Prüfe typische Fehler…",
    "Erstelle konkrete Schritte…",
    "Berechne deinen größten Fehler…"
  ];

  useEffect(() => {
    const totalDuration = 2000; // 2 seconds
    const stepDuration = totalDuration / steps.length;
    const progressInterval = 50; // Update every 50ms
    const progressPerInterval = (100 / totalDuration) * progressInterval;

    let elapsed = 0;
    let currentStepIndex = 0;

    const interval = setInterval(() => {
      elapsed += progressInterval;
      const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
      setProgress(newProgress);

      const newStepIndex = Math.floor((elapsed / stepDuration) % steps.length);
      if (newStepIndex !== currentStepIndex) {
        setCurrentStep(newStepIndex);
        currentStepIndex = newStepIndex;
      }

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        onComplete();
      }
    }, progressInterval);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-md mx-auto text-center py-12">
      <div className="mb-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Deine Analyse wird erstellt</h2>
        <p className="text-gray-600 text-sm h-6">{steps[currentStep]}</p>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-100 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <p className="text-xs text-gray-400">{Math.round(progress)}%</p>
    </div>
  );
}

function StepResult({ result }: { result: any }) {
  // Parse nextStep into individual bullet lines
  const nextStepLines = result.nextStep.split("\n").filter((l: string) => l.trim());
  // Split advice: risk = first line, typicalError = second line (after "Typischer Fehler:")
  const adviceLines = result.advice.split("\n").filter((l: string) => l.trim());
  const riskLine = adviceLines[0] || "";
  const errorLine = adviceLines[1] || "";
  // "Warum das wichtig ist" = last line of nextStep if it starts with "Warum"
  const whyLine = nextStepLines.find((l: string) => l.toLowerCase().startsWith("warum")) || "";
  const actionSteps = nextStepLines.filter((l: string) => !l.toLowerCase().startsWith("warum"));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Full classification + detailed explanation */}
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 text-green-700 mb-3">
          <CheckCircle size={24} />
          <h2 className="text-2xl font-bold">{result.title || "Deine vollständige Analyse"}</h2>
        </div>
        <p className="text-gray-800 leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid gap-4">
        {/* Risk */}
        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 text-amber-700 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Risiko</h3>
          </div>
          <p className="text-gray-700">{riskLine}</p>
        </div>

        {/* Typischer Fehler */}
        {errorLine && (
          <div className="bg-red-50 p-5 rounded-xl border border-red-100">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <X size={20} />
              <h3 className="font-bold">Typischer Fehler</h3>
            </div>
            <p className="text-gray-700">{errorLine.replace(/^Typischer Fehler:\s*/i, "")}</p>
          </div>
        )}

        {/* Concrete next steps */}
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-3">
            <Lightbulb size={20} />
            <h3 className="font-bold">Konkrete nächste Schritte</h3>
          </div>
          <ul className="space-y-2">
            {actionSteps.map((step: string, i: number) => (
              <li key={i} className="flex items-start gap-3 text-gray-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">{i + 1}</span>
                {step.replace(/^\d+\.\s*/, "")}
              </li>
            ))}
          </ul>
        </div>

        {/* Warum das wichtig ist */}
        {whyLine && (
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-600 text-sm italic">{whyLine}</p>
          </div>
        )}
      </div>

      {/* Transition text */}
      <p className="text-center text-gray-700 font-medium text-sm">👉 Genau für solche Fälle wurde diese Lösung entwickelt:</p>

      {/* Primary product */}
      <div className="bg-gray-900 text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Empfohlenes Produkt</p>
          <h3 className="font-bold text-lg">{(PRODUCT_MAP[result.product] || PRODUCT_MAP.elternschutzpaket).title}</h3>
          <p className="text-gray-300 text-sm">Vermeide typische Fehler und reagiere richtig auf dein Jugendamt-Schreiben.</p>
          <p className="text-orange-400 text-xs mt-2 font-medium">⚠️ Vermeide Fehler, die später gegen dich verwendet werden.</p>
          <p className="text-gray-400 text-xs mt-1">✓ sofort anwendbar &nbsp;&nbsp; ✓ keine Fehler mehr im Schreiben</p>
        </div>
        <a
          href={(PRODUCT_MAP[result.product] || PRODUCT_MAP.elternschutzpaket).href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors shrink-0"
        >
          Fehlerfreie Antwort jetzt erstellen → <ExternalLink size={18} />
        </a>
      </div>

      {/* Secondary product – elternschutzpaket, only when primary is different */}
      {result.product !== "elternschutzpaket" && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">Ergänzend empfohlen</p>
            <h3 className="font-bold text-gray-900">{PRODUCT_MAP.elternschutzpaket.title}</h3>
            <p className="text-gray-600 text-sm">Klare Struktur, sichere Formulierungen und direkte nächste Schritte.</p>
          </div>
          <a
            href={PRODUCT_MAP.elternschutzpaket.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2 border border-gray-800 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors shrink-0"
          >
            Alle Vorlagen ansehen → <ExternalLink size={16} />
          </a>
        </div>
      )}

      {/* CTA row: WhatsApp + Calendly */}
      <div className="grid sm:grid-cols-2 gap-4">
        <a
          href="https://wa.me/4915253482954"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-4 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <a
          href="https://calendly.com/rebellmitherz/rebellsystem"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-colors"
        >
          <div className="flex flex-col items-center text-center px-2">
            <div className="flex items-center gap-2 mb-0.5">
              <Calendar size={20} />
              <span className="text-lg">Kurzes Erstgespräch zur Einschätzung</span>
            </div>
            <span className="text-[11px] font-normal leading-tight opacity-90">
              In etwa 10 Minuten klären wir gemeinsam den aktuellen Stand und die nächsten Schritte. So stellen wir sicher, dass eine Zusammenarbeit für beide Seiten sinnvoll ist.
            </span>
          </div>
        </a>
      </div>
    </div>
  );
}

export default function Fallcheck() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<FunnelStep>("input");
  const [result, setResult] = useState<any>(null);

  // Load persisted state on mount
  useEffect(() => {
    try {
      const savedResult = localStorage.getItem("fallcheck_result");
      const savedStep = localStorage.getItem("fallcheck_step");

      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        setResult(parsedResult);
        
        // Restore the exact step user was on
        if (savedStep && ["preview", "email-gate", "email-loading", "result"].includes(savedStep)) {
          setStep(savedStep as FunnelStep);
        } else {
          // Default to preview if result exists but step is unknown
          setStep("preview");
        }
      }
    } catch (e) {
      console.error("Failed to load saved state from localStorage", e);
      // Clear corrupted data
      localStorage.removeItem("fallcheck_result");
      localStorage.removeItem("fallcheck_step");
    }
  }, []);

  // Persist result whenever it changes
  useEffect(() => {
    if (result) {
      try {
        localStorage.setItem("fallcheck_result", JSON.stringify(result));
      } catch (e) {
        console.error("Failed to save result to localStorage", e);
      }
    }
  }, [result]);

  // Persist step whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem("fallcheck_step", step);
    } catch (e) {
      console.error("Failed to save step to localStorage", e);
    }
  }, [step]);

  const handleInput = async (text: string) => {
    if (!text.trim()) return;
    setStep("analysis");
    // Save user input for recovery
    try {
      localStorage.setItem("fallcheck_input", text);
    } catch (e) {
      console.error("Failed to save input", e);
    }
    try {
      const analysis = await analyzeCase(text);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed", error);
    }
  };  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => {
            if (step === "input") {
              localStorage.removeItem("fallcheck_result");
              localStorage.removeItem("fallcheck_step");
              localStorage.removeItem("fallcheck_input");
              setLocation("/");
            } else {
              setStep("input");
            }
          }}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Zurück
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">
          {step === "input" && <StepInput onSubmit={handleInput} />}
          {step === "analysis" && <StepAnalysis onComplete={() => setStep("preview")} />}
          {step === "preview" && result && <StepPreview result={result} onContinue={() => setStep("email-gate")} />}
          {step === "email-gate" && <StepEmailGate onUnlock={() => setStep("email-loading")} />}
          {step === "email-loading" && <StepEmailLoading onComplete={() => setStep("result")} />}
          {step === "result" && result && <StepResult result={result} />}
        </div>
      </div>
    </div>
  );
}
