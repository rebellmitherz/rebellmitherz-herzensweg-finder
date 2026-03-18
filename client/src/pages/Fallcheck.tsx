import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Upload, X, FileText, Calendar, CheckCircle, AlertTriangle, Lightbulb, ExternalLink, Lock } from "lucide-react";
import { analyzeCase } from "../lib/analyzeCase";

type FunnelStep = "input" | "analysis" | "preview" | "email-gate" | "result";

const PRODUCT_MAP = {
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
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 text-blue-700 mb-2">
          <CheckCircle size={24} />
          <h2 className="text-xl font-bold">{result.title || "Erste Einschätzung"}</h2>
        </div>
        <p className="text-gray-800">{result.summary}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border shadow-sm">
        <h3 className="font-bold mb-3 flex items-center gap-2 text-gray-800"><Lightbulb size={18} /> Erste Hinweise</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />{result.advice}</li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />{result.nextStep}</li>
          <li className="flex items-start gap-2"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />Detaillierte Auswertung nach Freischaltung verfügbar.</li>
        </ul>
      </div>

      <button
        onClick={onContinue}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
      >
        Vollständige Analyse freischalten <ArrowRight size={18} />
      </button>
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

function StepResult({ result }: { result: any }) {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <CheckCircle size={24} />
          <h2 className="text-2xl font-bold">{result.title || "Deine Analyse"}</h2>
        </div>
        <p className="text-lg text-gray-800 leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Lightbulb size={20} />
            <h3 className="font-bold">Empfehlung</h3>
          </div>
          <p className="text-gray-700">{result.advice}</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex items-center gap-2 text-amber-600 mb-2">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Nächster Schritt</h3>
          </div>
          <p className="text-gray-700">{result.nextStep}</p>
        </div>
      </div>

      <div className="bg-gray-900 text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-lg">{PRODUCT_MAP.elternschutzpaket.title}</h3>
          <p className="text-gray-400 text-sm">{PRODUCT_MAP.elternschutzpaket.description}</p>
        </div>
        <a 
          href={PRODUCT_MAP.elternschutzpaket.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-2 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors shrink-0"
        >
          Zum Produkt <ExternalLink size={18} />
        </a>
      </div>
    </div>
  );
}

export default function Fallcheck() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<FunnelStep>("input");
  const [result, setResult] = useState<any>(null);

  const handleInput = async (text: string) => {
    if (!text.trim()) return;
    setStep("analysis");
    try {
      const analysis = await analyzeCase(text);
      setResult(analysis);
    } catch (error) {
      console.error("Analysis failed", error);
      // Fallback if needed, but we use the result from analyzeCase
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => step === "input" ? setLocation("/") : setStep("input")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> Zurück
        </button>

        <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-10">
          {step === "input" && <StepInput onSubmit={handleInput} />}
          {step === "analysis" && <StepAnalysis onComplete={() => setStep("preview")} />}
          {step === "preview" && result && <StepPreview result={result} onContinue={() => setStep("email-gate")} />}
          {step === "email-gate" && <StepEmailGate onUnlock={() => setStep("result")} />}
          {step === "result" && result && <StepResult result={result} />}
        </div>
      </div>
    </div>
  );
}
