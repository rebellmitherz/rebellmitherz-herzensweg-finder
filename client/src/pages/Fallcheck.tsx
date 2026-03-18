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
  summary: "Deine Situation zeigt typische Konfliktmuster. Das Problem ist nicht nur das Ereignis selbst, sondern wie darauf reagiert wird.",
  riskNote: "Unstrukturierte Reaktionen führen oft dazu, dass du später schlechter dastehst, obwohl du im Kern recht hast.",
  nextStep: "Ordne zuerst sauber: Was ist passiert, was ist belegt, was ist deine konkrete Zielrichtung.",
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
      <h2 className="text-2xl font-bold mb-4">Was ist deine Situation?</h2>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Beschreibe deine Situation..."
        className="w-full h-40 p-4 border rounded-lg mb-4"
        style={{ width: "100%", height: 150 }}
      />
      <div className="flex gap-4">
        <button 
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
        >
          <Upload size={20} /> Dokument hochladen
        </button>
        <input ref={fileRef} type="file" className="hidden" />
        <button 
          onClick={() => onSubmit(text)}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Auswerten <ArrowRight size={20} />
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
      <p className="text-gray-600">Bitte kurz warten, wir werten deine Angaben aus.</p>
    </div>
  );
}

function StepEmailGate({ onUnlock }: { onUnlock: () => void }) {
  const [email, setEmail] = useState("");

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-blue-50 p-6 rounded-xl mb-6">
        <Lock className="text-blue-600 mb-2" size={32} />
        <h3 className="text-xl font-bold mb-2">Analyse bereit</h3>
        <p className="text-gray-700">Gib deine E-Mail-Adresse ein, um die vollständige Auswertung und Handlungsempfehlung freizuschalten.</p>
      </div>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Deine E-Mail-Adresse"
        className="w-full p-3 border rounded-lg mb-4"
      />
      <button 
        onClick={onUnlock}
        className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
      >
        Jetzt kostenlos freischalten
      </button>
    </div>
  );
}

function StepResult({ result }: { result: typeof FALLBACK_RESULT }) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-6 rounded-xl border border-green-100">
        <div className="flex items-center gap-2 text-green-700 mb-2">
          <CheckCircle size={24} />
          <h2 className="text-2xl font-bold">Deine Analyse</h2>
        </div>
        <p className="text-lg text-gray-800 leading-relaxed">{result.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
          <div className="flex items-center gap-2 text-amber-700 mb-3">
            <AlertTriangle size={20} />
            <h3 className="font-bold">Risiko-Hinweis</h3>
          </div>
          <p className="text-gray-700">{result.riskNote}</p>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 mb-3">
            <Lightbulb size={20} />
            <h3 className="font-bold">Nächster Schritt</h3>
          </div>
          <p className="text-gray-700">{result.nextStep}</p>
        </div>
      </div>

      {result.detailBlocks?.map((block, idx) => (
        <div key={idx} className="border rounded-xl p-6">
          <h3 className="font-bold text-lg mb-4">{block.title}</h3>
          <ul className="space-y-3">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="bg-gray-900 text-white p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold mb-2">{PRODUCT_MAP.elternschutzpaket.title}</h3>
          <p className="text-gray-400">{PRODUCT_MAP.elternschutzpaket.description}</p>
        </div>
        <a 
          href={PRODUCT_MAP.elternschutzpaket.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-100 shrink-0"
        >
          Zum Produkt <ExternalLink size={20} />
        </a>
      </div>
    </div>
  );
}

export default function Fallcheck() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<FunnelStep>("input");
  const [result, setResult] = useState<any>(null);

  const handleInput = (text: string) => {
    if (!text.trim()) return;
    setStep("analysis");
  };

  const handleAnalysisComplete = () => {
    setResult(FALLBACK_RESULT);
    setStep("email-gate");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <button 
          onClick={() => step === "input" ? setLocation("/") : setStep("input")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8"
        >
          <ArrowLeft size={20} /> Zurück
        </button>

        {step === "input" && <StepInput onSubmit={handleInput} />}
        {step === "analysis" && <StepAnalysis onComplete={handleAnalysisComplete} />}
        {step === "email-gate" && <StepEmailGate onUnlock={() => setStep("result")} />}
        {step === "result" && result && <StepResult result={result} />}
      </div>
    </div>
  );
}
