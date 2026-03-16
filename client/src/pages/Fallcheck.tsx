/*
 * FALLCHECK – Vereinfachter Funnel
 * Flow: Eingabe → Analyse-Animation → MailerLite-Gate (Pflicht) → Ergebnis → Produkt-Pitch
 * MailerLite form ID: 3h2dEy | Calendly: https://calendly.com/rebellmitherz/rebellsystem
 * WhatsApp: 015253482954
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, ArrowRight, Upload, X, FileText, ChevronRight, Calendar, CheckCircle, AlertTriangle, Lightbulb, ExternalLink, Lock } from "lucide-react";
import { analyzeCase } from "@/lib/analyzeCase";
import type { AnalysisResult } from "@/lib/analyzeCase";
import { sendToMakeWebhook } from "@/lib/makeWebhook";

// ── Types ──────────────────────────────────────────────────────────────────
type FunnelStep = "input" | "analysis" | "email-gate" | "result";

// ── Product Map ────────────────────────────────────────────────────────────
const PRODUCT_MAP: Record<string, { title: string; href: string; description: string }> = {
  jugendamt_antworten: { title: "Jugendamt-Antworten", href: "https://www.rebellsystem.de/jugendamt-antworten-produkt.html", description: "Verstehe jedes Schreiben und reagiere rechtssicher." },
  gutachten: { title: "Gutachten-Analyse", href: "https://www.rebellsystem.de/gutachten-produkt.html", description: "Verstehe und hinterfrage Gutachten systematisch." },
  akteneinsicht: { title: "Akteneinsicht", href: "https://www.rebellsystem.de/akteneinsicht-produkt.html", description: "Schritt-für-Schritt zur vollständigen Akteneinsicht." },
  protokollberichtigung: { title: "Protokollberichtigung", href: "https://www.rebellsystem.de/protokollberichtigung-produkt.html", description: "So korrigierst du fehlerhafte Protokolle rechtssicher." },
  durchsetzung: { title: "Durchsetzung", href: "https://www.rebellsystem.de/durchsetzung-produkt.html", description: "Lerne, wie du bestehende Beschlüsse durchsetzen kannst." },
  elternschutzpaket: { title: "Elternschutzpaket", href: "https://www.rebellsystem.de/elternschutzpaket-produkt.html", description: "Dein Rundum-Schutz mit Vorlagen, Checklisten und Anleitungen." },
};

const COMPLEX_TYPES = ["komplexe_situation", "durchsetzung", "gutachten"];

const ANALYSIS_STEPS = [
  "Eingabe wird gelesen…",
  "Rechtliche Muster werden geprüft…",
  "Situation wird klassifiziert…",
  "Risiken werden bewertet…",
  "Handlungsplan wird erstellt…",
];

// Fallback-Ergebnis bei API-Fehler
const FALLBACK_RESULT: AnalysisResult = {
  problemType: "komplexe_situation",
  primaryProduct: "elternschutzpaket",
  secondaryProduct: "elternschutzpaket",
  isComplex: true,
  summary: "Deine Situation umfasst mehrere Themen gleichzeitig. Das ist normal – aber es braucht jetzt eine klare Priorisierung, damit du nicht an mehreren Fronten gleichzeitig Fehler machst.",
  riskNote: "Versuche nicht, alles gleichzeitig zu lösen. Konzentriere dich auf das, was gerade die höchste Dringlichkeit hat.",
  nextStep: "Sortiere deine offenen Punkte nach Dringlichkeit und arbeite sie einzeln ab – beginnend mit dem Thema, bei dem eine Frist läuft.",
  detailBlocks: [
    { title: "Was für die Einordnung entscheidend ist", items: ["Gibt es eine laufende Frist? Dann hat diese oberste Priorität.", "Steht ein Termin bevor? Dann Vorbereitung vorziehen.", "Wurde ein Beschluss erlassen oder ein Gutachten zugestellt? Dann zuerst prüfen."] },
    { title: "Nächster sinnvoller Schritt", items: ["Schreibe alle offenen Punkte auf und ordne sie nach Dringlichkeit. Dann arbeite sie einzeln ab – nicht alles gleichzeitig."] },
  ],
};

// ── Progress Bar ────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: FunnelStep }) {
  const steps: FunnelStep[] = ["input", "analysis", "email-gate", "result"];
  const current = steps.indexOf(step);
  const pct = Math.round(((current) / (steps.length - 1)) * 100);

  return (
    <div className="w-full bg-border rounded-full h-1.5 mb-8">
      <div
        className="h-1.5 rounded-full bg-primary transition-all duration-700 ease-out"
        style={{ width: `${Math.max(8, pct)}%` }}
      />
    </div>
  );
}

// ── Step 1: Text Input ──────────────────────────────────────────────────────
function StepInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
  };

  const canSubmit = text.trim().length >= 10 || fileName !== null;

  return (
    <div className="animate-slide-up">
      <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-foreground mb-2">
        Was ist deine Situation?
      </h2>
      <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
        Beschreibe kurz, was passiert ist. Die KI erkennt das Thema automatisch und gibt dir eine strukturierte Einordnung.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={`Beschreibe deine Situation – z. B.:

• „Ich habe ein Schreiben vom Jugendamt bekommen und weiß nicht, wie ich reagieren soll."
• „Ich habe einen Beschluss, aber der andere Elternteil hält sich nicht daran."
• „Ich soll ein Gutachten bekommen und weiß nicht, was mich erwartet."
• „Das Protokoll vom letzten Termin stimmt nicht."
• „Ich habe bald ein Gespräch beim Jugendamt und bin unsicher."

Kein Juristendeutsch nötig – schreib einfach, wie es ist.`}
        className="w-full min-h-[220px] p-4 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-y text-sm leading-relaxed"
      />

      <div className="mt-3">
        <input ref={fileRef} type="file" accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx" onChange={handleFile} className="hidden" />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-border rounded-xl text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all w-full justify-center"
        >
          <Upload className="w-4 h-4" />
          {fileName ? (
            <span className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-primary" />
              {fileName}
              <button onClick={(e) => { e.stopPropagation(); setFileName(null); }} className="text-muted-foreground hover:text-destructive">
                <X className="w-3.5 h-3.5" />
              </button>
            </span>
          ) : "Dokument hinzufügen – PDF, Bild oder Text (optional)"}
        </button>
      </div>

      <button
        onClick={() => onSubmit(text)}
        disabled={!canSubmit}
        className="mt-6 w-full flex items-center justify-center gap-2 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 text-base"
      >
        Situation jetzt auswerten <ArrowRight className="w-4 h-4" />
      </button>

      <div className="mt-4 flex items-center justify-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Anonym</span>
        <span>·</span>
        <span>Kostenlos</span>
        <span>·</span>
        <span>Keine Anmeldung</span>
      </div>
    </div>
  );
}

// ── Step 2: Analysis Animation ──────────────────────────────────────────────
function StepAnalysis({ onComplete }: { onComplete: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const totalDuration = 3800;
    const stepDuration = totalDuration / ANALYSIS_STEPS.length;
    let elapsed = 0;

    const interval = setInterval(() => {
      elapsed += 80;
      setProgress(Math.min(100, Math.round((elapsed / totalDuration) * 100)));
      setStepIdx(Math.min(ANALYSIS_STEPS.length - 1, Math.floor(elapsed / stepDuration)));

      if (elapsed >= totalDuration) {
        clearInterval(interval);
        setTimeout(onComplete, 400);
      }
    }, 80);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="animate-slide-up text-center py-8">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="pulse-dot w-2.5 h-2.5 rounded-full bg-primary"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <h2 className="font-['Fraunces'] text-2xl font-bold text-foreground mb-2">
        Dein Fall wird analysiert
      </h2>
      <p className="text-muted-foreground text-sm mb-8">Bitte einen Moment Geduld…</p>

      <div className="max-w-sm mx-auto">
        <div className="bg-border rounded-full h-2 mb-4">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="space-y-2">
          {ANALYSIS_STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex items-center gap-2.5 text-sm transition-all duration-300 ${i <= stepIdx ? "text-foreground" : "text-muted-foreground/40"}`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${i < stepIdx ? "bg-primary" : i === stepIdx ? "bg-primary/30 animate-pulse" : "bg-border"}`}>
                {i < stepIdx && <CheckCircle className="w-3 h-3 text-primary-foreground" />}
              </span>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Step 3: Email Gate (MailerLite – Pflicht) ───────────────────────────────
function StepEmailGate({
  result,
  onUnlock,
}: {
  result: AnalysisResult;
  onUnlock: (email: string) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  // MailerLite-Formular laden
  useEffect(() => {
    if (submitted) return;

    // Warte, bis MailerLite geladen ist
    const checkMailerLite = setInterval(() => {
      if ((window as any).ml) {
        clearInterval(checkMailerLite);
        // Versuche, das Formular zu laden
        (window as any).ml('form', '3h2dEy');
      }
    }, 100);

    return () => clearInterval(checkMailerLite);
  }, [submitted]);

  // Überwache E-Mail-Eingabe
  useEffect(() => {
    if (submitted) return;

    const checkEmail = setInterval(() => {
      const emailInput = document.querySelector<HTMLInputElement>(
        ".ml-embedded input[type='email'], .ml-form-embedBody input[type='email']"
      );
      if (emailInput?.value) {
        setEmail(emailInput.value);
      }
    }, 500);

    return () => clearInterval(checkEmail);
  }, [submitted]);

  // Überwache MailerLite-Erfolg
  useEffect(() => {
    if (submitted) return;

    const observer = new MutationObserver(() => {
      const success = document.querySelector(".ml-form-successBody");
      if (success && (success as HTMLElement).style.display !== "none") {
        setSubmitted(true);
        sendToMakeWebhook(email || "unknown@email.com", result).catch(() => {});
        setTimeout(() => onUnlock(email || "unknown@email.com"), 1200);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });

    return () => observer.disconnect();
  }, [submitted, email, result, onUnlock]);

  return (
    <div className="animate-slide-up">
      {/* Partial result preview – sichtbar */}
      <div className="mb-5 p-5 bg-card border border-border rounded-xl">
        <div className="flex items-start gap-3 mb-3">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">Erste Einordnung</p>
            <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>
        {result.riskNote && (
          <div className="flex items-start gap-3 mt-3 pt-3 border-t border-border">
            <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">{result.riskNote}</p>
          </div>
        )}
      </div>

      {/* Blurred teaser */}
      <div className="relative mb-5 rounded-xl overflow-hidden">
        <div className="p-5 bg-card border border-border rounded-xl blur-sm select-none pointer-events-none">
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-2">Dein vollständiger Handlungsplan</p>
          <p className="text-sm text-foreground">████████████████████████████████████████████████████████████████████████</p>
          <p className="text-sm text-foreground mt-2">████████████████████████████████████████████████████</p>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-4 mb-2">Konkrete nächste Schritte</p>
          <p className="text-sm text-foreground">████████████████████████████████████████████████████████████████████████████████████████</p>
          <p className="text-xs font-semibold text-primary uppercase tracking-wide mt-4 mb-2">Passende Unterstützung</p>
          <p className="text-sm text-foreground">████████████████████████████████████████████████</p>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 backdrop-blur-[2px] rounded-xl">
          <div className="text-center px-6">
            <Lock className="w-6 h-6 text-primary mx-auto mb-2" />
            <p className="font-['Fraunces'] text-lg font-bold text-foreground mb-1">Vollständige Analyse freischalten</p>
            <p className="text-sm text-muted-foreground">Trage deine E-Mail ein – kostenlos, kein Spam.</p>
          </div>
        </div>
      </div>

      {/* MailerLite Form – Pflicht, kein Skip */}
      {!submitted ? (
        <div className="bg-card border-2 border-primary/20 rounded-xl p-5">
          <p className="text-sm font-semibold text-foreground mb-1">Handlungsplan kostenlos erhalten</p>
          <p className="text-xs text-muted-foreground mb-4">
            Kostenlos · Kein Spam · Jederzeit abmeldbar
          </p>
          {/* MailerLite Embed */}
          <div className="ml-embedded" data-form="3h2dEy" />
          {/* Fallback: Manuelles E-Mail-Feld */}
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Falls das Formular nicht lädt:</p>
            <input
              type="email"
              placeholder="deine@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
            />
            <button
              onClick={() => {
                if (email && email.includes("@")) {
                  setSubmitted(true);
                  sendToMakeWebhook(email, result).catch(() => {});
                  setTimeout(() => onUnlock(email), 1200);
                }
              }}
              className="mt-2 w-full py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition-all"
            >
              Freischalten
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          <CheckCircle className="w-10 h-10 text-primary mx-auto mb-3" />
          <p className="font-['Fraunces'] text-lg font-semibold text-foreground">Danke!</p>
          <p className="text-sm text-muted-foreground mt-1">Deine vollständige Analyse wird geladen…</p>
        </div>
      )}
    </div>
  );
}

// ── Step 4: Full Result ─────────────────────────────────────────────────────
function StepResult({
  result,
  onRestart,
}: {
  result: AnalysisResult;
  onRestart: () => void;
}) {
  const primary = PRODUCT_MAP[result.primaryProduct] || PRODUCT_MAP.elternschutzpaket;
  const secondary = result.primaryProduct !== result.secondaryProduct ? PRODUCT_MAP[result.secondaryProduct] : null;
  const showConsulting = COMPLEX_TYPES.includes(result.problemType) || result.isComplex;

  return (
    <div className="animate-slide-up space-y-4 pb-8">
      <div>
        <h2 className="font-['Fraunces'] text-2xl sm:text-3xl font-bold text-foreground mb-1">
          Deine Analyse
        </h2>
        <p className="text-muted-foreground text-sm">Hier ist, was wir aus deiner Eingabe erkannt haben.</p>
      </div>

      {/* Summary */}
      <div className="p-5 bg-card border border-border rounded-xl">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Einordnung</p>
            <p className="text-sm text-foreground leading-relaxed">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Risk Note */}
      {result.riskNote && (
        <div className="p-5 bg-destructive/5 border border-destructive/20 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-destructive uppercase tracking-wide mb-1.5">Worauf es ankommt</p>
              <p className="text-sm text-foreground leading-relaxed">{result.riskNote}</p>
            </div>
          </div>
        </div>
      )}

      {/* Detail Blocks */}
      {result.detailBlocks?.map((block, i) => (
        <div key={i} className="p-5 bg-card border border-border rounded-xl">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">{block.title}</p>
          {block.items.length === 1 ? (
            <p className="text-sm text-foreground leading-relaxed">{block.items[0]}</p>
          ) : (
            <ul className="space-y-2">
              {block.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      {/* Next Step */}
      <div className="p-5 bg-primary/5 border border-primary/20 rounded-xl">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1.5">Nächster Schritt</p>
            <p className="text-sm text-foreground leading-relaxed">{result.nextStep}</p>
          </div>
        </div>
      </div>

      {/* Product Recommendation */}
      <div className="pt-2">
        <p className="font-['Fraunces'] text-lg font-semibold text-foreground mb-1">Praktische Unterstützung</p>
        <p className="text-sm text-muted-foreground mb-4">
          Die Einordnung hilft dir zu verstehen, wo du stehst. Für die konkrete Umsetzung brauchst du mehr.
        </p>
        <div className="space-y-3">
          <a
            href={primary.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start justify-between gap-3 p-5 rounded-xl border bg-primary/5 border-primary/30 hover:border-primary/60 hover:bg-primary/8 transition-all group"
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-foreground text-sm">{primary.title}</span>
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Empfohlen</span>
              </div>
              <span className="text-xs text-muted-foreground">{primary.description}</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
          </a>

          {secondary && (
            <a
              href={secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-3 p-5 rounded-xl border bg-card border-border hover:border-primary/30 transition-all group"
            >
              <div>
                <span className="font-semibold text-foreground text-sm block mb-1">{secondary.title}</span>
                <span className="text-xs text-muted-foreground">{secondary.description}</span>
              </div>
              <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
            </a>
          )}
        </div>
      </div>

      {/* Consulting CTA (only for complex cases) */}
      {showConsulting && (
        <div className="p-5 bg-accent/5 border border-accent/20 rounded-xl">
          <div className="flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm mb-1">Kostenlose 10-Minuten-Beratung</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dein Fall ist komplex. In einem kurzen Gespräch können wir gemeinsam herausfinden, welcher nächste Schritt für dich der richtige ist.
              </p>
            </div>
          </div>
          <a
            href="https://calendly.com/rebellmitherz/rebellsystem"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 bg-accent text-accent-foreground rounded-xl font-semibold text-sm hover:bg-accent/90 transition-all"
          >
            <Calendar className="w-4 h-4" />
            Kostenlos Termin buchen
          </a>
          <p className="text-center text-xs text-muted-foreground mt-2">10 Minuten · Kostenlos · Unverbindlich</p>
        </div>
      )}

      {/* WhatsApp CTA */}
      <a
        href="https://wa.me/4915253482954"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2.5 w-full py-3.5 border border-[#25D366]/40 bg-[#25D366]/5 text-foreground rounded-xl font-medium text-sm hover:bg-[#25D366]/10 transition-all"
      >
        <svg className="w-4 h-4 fill-[#25D366]" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462.267 2.868.319 3.077.052.209.864 1.421 2.099 1.994 1.469.823 2.614.964 3.552.81.905-.144 2.77-.567 3.157-1.117.387-.55.387-1.021.271-1.119-.116-.098-.424-.148-.88-.262z" />
        </svg>
        Frage stellen
      </a>

      {/* Restart Button */}
      <button
        onClick={onRestart}
        className="w-full py-3 border border-border text-foreground rounded-xl font-medium text-sm hover:bg-card transition-all"
      >
        Neuer Fallcheck
      </button>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────
export default function Fallcheck() {
  const [navigate] = useLocation();
  const [step, setStep] = useState<FunnelStep>("input");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleInput = async (text: string) => {
    setStep("analysis");
    try {
      const analysisResult = await analyzeCase(text);
      setResult(analysisResult);
      setStep("email-gate");
    } catch (error) {
      console.error("Analysis error:", error);
      setResult(FALLBACK_RESULT);
      setStep("email-gate");
    }
  };

  const handleUnlock = () => {
    setStep("result");
  };

  const handleRestart = () => {
    setStep("input");
    setResult(null);
  };

  return (
    <div className="min-h-screen grain-overlay">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span
            className="font-['Fraunces'] text-lg font-semibold text-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            Rebell mit Herz
          </span>
          <button
            onClick={() => navigate("/")}
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> Zurück
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <ProgressBar step={step} />

        {step === "input" && <StepInput onSubmit={handleInput} />}
        {step === "analysis" && <StepAnalysis onComplete={() => {}} />}
        {step === "email-gate" && result && (
          <StepEmailGate result={result} onUnlock={handleUnlock} />
        )}
        {step === "result" && result && (
          <StepResult result={result} onRestart={handleRestart} />
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span className="font-['Fraunces'] font-semibold text-foreground">Rebell mit Herz</span>
          <div className="flex flex-wrap justify-center gap-5">
            <a href="/" className="hover:text-foreground transition-colors">Startseite</a>
            <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
            <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
            <span>© 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
