/*
 * DESIGN: Moderne Sachlichkeit mit Wärme
 * Fraunces headings, DM Sans body
 * Warm Beige bg, Deep Navy primary, Terracotta accent
 */
import { useState } from "react";
import { useLocation } from "wouter";
import { Shield, Clock, Lock, ChevronRight, Star, ChevronDown, FileText, Scale, BookOpen } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663085608196/gprvBBiG4kqst5Rgb7LeDs/hero-bg-DUGXd5sRgBrNjo3VQQMpUH.webp";
const ANALYSIS_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663085608196/gprvBBiG4kqst5Rgb7LeDs/analysis-visual-b4VcYTLaspCRyCVnrVkfuM.webp";

const STEPS = [
  {
    num: "01",
    title: "Situation schildern",
    desc: "Beschreibe kurz, was passiert ist – oder lade ein Dokument hoch. Kein Juristendeutsch nötig.",
    icon: <FileText className="w-5 h-5" />,
  },
  {
    num: "02",
    title: "KI analysiert deinen Fall",
    desc: "Unsere KI erkennt das Thema, prüft rechtliche Muster und erstellt eine strukturierte Einordnung.",
    icon: <Scale className="w-5 h-5" />,
  },
  {
    num: "03",
    title: "Handlungsplan erhalten",
    desc: "Du bekommst konkrete nächste Schritte, Risiken und passende Unterstützung – sofort und kostenlos.",
    icon: <BookOpen className="w-5 h-5" />,
  },
];



const TESTIMONIALS = [
  {
    text: "Endlich verstehe ich, was das Jugendamt von mir will. Der Fallcheck hat mir in 3 Minuten mehr Klarheit gegeben als Wochen des Grübelns.",
    name: "Mutter, 34",
    topic: "Schreiben verstehen",
    stars: 5,
  },
  {
    text: "Ich hatte Angst vor dem Gespräch. Nach dem Fallcheck wusste ich genau, was ich sagen soll – und was nicht.",
    name: "Vater, 41",
    topic: "Gespräch vorbereiten",
    stars: 5,
  },
  {
    text: "Das Gutachten war für mich unlesbar. Der Fallcheck hat mir gezeigt, worauf ich achten muss. Sehr hilfreich.",
    name: "Mutter, 29",
    topic: "Gutachten verstehen",
    stars: 5,
  },
  {
    text: "Ich dachte, ich bin allein mit dem Problem. Der Fallcheck hat mir gezeigt, dass es klare Schritte gibt. Das hat mir Kraft gegeben.",
    name: "Vater, 38",
    topic: "Beschluss durchsetzen",
    stars: 5,
  },
  {
    text: "Innerhalb von Minuten hatte ich eine klare Einordnung meiner Situation. Ich wusste endlich, wo ich anfangen soll.",
    name: "Mutter, 45",
    topic: "Akteneinsicht",
    stars: 5,
  },
  {
    text: "Das Protokoll war falsch und ich wusste nicht, was ich tun soll. Der Fallcheck hat mir den nächsten Schritt klar gemacht.",
    name: "Vater, 33",
    topic: "Protokollfehler prüfen",
    stars: 5,
  },
];

const TRUST_STATS = [
  { value: "2.400+", label: "Fallchecks durchgeführt" },
  { value: "7", label: "Situationstypen erkannt" },
  { value: "2 Min.", label: "Ø Zeit bis zum Ergebnis" },
  { value: "100%", label: "Kostenlos & anonym" },
];

const FAQ = [
  {
    q: "Ist der Fallcheck wirklich kostenlos?",
    a: "Ja, vollständig. Du brauchst keine Kreditkarte, keine Anmeldung. Der Fallcheck ist ein kostenloser Service von Rebell mit Herz.",
  },
  {
    q: "Werden meine Daten gespeichert?",
    a: "Nein. Deine Eingabe wird ausschließlich für die Analyse verwendet und danach nicht gespeichert. Wir erheben keine personenbezogenen Daten ohne deine Zustimmung.",
  },
  {
    q: "Wie genau ist die KI-Analyse?",
    a: "Die KI erkennt die Kernthemen deiner Situation zuverlässig und gibt dir strukturierte, situationsbezogene Hinweise. Sie ersetzt keine Rechtsberatung, aber sie hilft dir zu verstehen, wo du stehst und was als nächstes zu tun ist.",
  },
  {
    q: "Was passiert nach dem Fallcheck?",
    a: "Du bekommst eine strukturierte Analyse mit konkreten nächsten Schritten. Optional kannst du eine kostenlose 10-Minuten-Beratung buchen oder direkt auf passende Unterstützungsangebote zugreifen.",
  },
  {
    q: "Kann ich auch Dokumente hochladen?",
    a: "Ja. Du kannst PDFs, Bilder oder Textdateien hochladen. Die KI liest den Inhalt und berücksichtigt ihn bei der Analyse.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/30 transition-colors"
      >
        <span className="font-semibold text-foreground text-sm pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed pt-4">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen grain-overlay">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span
            className="font-['Fraunces'] text-lg font-semibold text-foreground cursor-pointer"
            onClick={() => navigate("/")}
          >
            Rebell mit Herz
          </span>
          <button
            onClick={() => navigate("/fallcheck")}
            className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center gap-1"
          >
            Fallcheck starten <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-14 min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${HERO_BG})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Kostenlos · Anonym · Sofortergebnis
            </div>

            <h1 className="font-['Fraunces'] text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
              Verstehe deine{" "}
              <span className="italic text-accent">Situation</span>{" "}
              im Familienrecht.
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Du hast ein Schreiben bekommen, ein Gespräch steht bevor oder ein Beschluss wird nicht umgesetzt?
              Unser KI-Fallcheck gibt dir in 2 Minuten Klarheit – ohne Anmeldung.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/fallcheck")}
                className="group flex items-center justify-center gap-2 px-7 py-4 bg-primary text-primary-foreground rounded-xl font-semibold text-base hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
              >
                Fallcheck jetzt starten
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <a
                href="https://www.rebellsystem.de"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-7 py-4 border border-border rounded-xl font-medium text-foreground hover:bg-secondary transition-all duration-200 text-base"
              >
                Mehr erfahren
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              {[
                { icon: <Lock className="w-3.5 h-3.5" />, text: "Keine Anmeldung" },
                { icon: <Shield className="w-3.5 h-3.5" />, text: "Anonym & sicher" },
                { icon: <Clock className="w-3.5 h-3.5" />, text: "Ergebnis in 2 Min." },
              ].map((b) => (
                <div key={b.text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="text-primary">{b.icon}</span>
                  {b.text}
                </div>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center">
            <div
              className="bg-card/90 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              onClick={() => navigate("/fallcheck")}
            >
              <p className="text-xs font-semibold text-accent uppercase tracking-widest mb-3">Fallcheck starten</p>
              <div className="w-full min-h-[120px] p-4 bg-background/60 border border-border rounded-xl text-sm text-muted-foreground/70 leading-relaxed mb-4 italic">
                „Ich habe ein Schreiben vom Jugendamt bekommen und weiß nicht, wie ich reagieren soll…"
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Kostenlos · Anonym · 2 Min.</span>
                <span className="flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Auswerten <ChevronRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST STATS ── */}
      <section className="py-14 bg-secondary/40 border-y border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {TRUST_STATS.map((s) => (
              <div key={s.label}>
                <p className="font-['Fraunces'] text-3xl font-bold text-primary mb-1">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-14">
            <div>
              <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-3">So funktioniert es</p>
              <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-bold text-foreground">
                In 3 Schritten zur Klarheit
              </h2>
            </div>
            <div className="hidden lg:block rounded-2xl overflow-hidden shadow-xl">
              <img src={ANALYSIS_IMG} alt="KI-Analyse" className="w-full h-48 object-cover" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s, i) => (
              <div key={s.num} className="relative">
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
                )}
                <div className="relative z-10 bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-4">
                    <span className="font-['Fraunces'] text-4xl font-bold text-primary/15 leading-none">{s.num}</span>
                    <div className="p-2 rounded-xl bg-primary/8 text-primary mt-1">{s.icon}</div>
                  </div>
                  <h3 className="font-['Fraunces'] text-xl font-semibold text-foreground mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <button
              onClick={() => navigate("/fallcheck")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
            >
              Jetzt kostenlos starten <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── WIE ES FUNKTIONIERT (kompakt) ── */}
      <section className="py-16 bg-secondary/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-3">Wie es funktioniert</p>
          <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Einfach beschreiben – die KI erkennt den Rest
          </h2>
          <p className="text-muted-foreground leading-relaxed mb-10 max-w-xl mx-auto">
            Kein Auswahlmenü, kein Formular. Du schreibst, was passiert ist – egal ob Jugendamt-Schreiben, Gutachten, Beschluss oder Gespräch. Die KI klassifiziert deine Situation automatisch.
          </p>
          <button
            onClick={() => navigate("/fallcheck")}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5"
          >
            Jetzt Situation beschreiben <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-primary-foreground/60 uppercase mb-3">Erfahrungen</p>
            <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-bold">
              Was andere Eltern sagen
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-6">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-primary-foreground/85 text-sm leading-relaxed mb-4 italic">
                  „{t.text}"
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-primary-foreground/50 text-xs font-medium">{t.name}</p>
                  <span className="text-xs bg-primary-foreground/10 text-primary-foreground/60 px-2 py-0.5 rounded-full">{t.topic}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-3">Häufige Fragen</p>
            <h2 className="font-['Fraunces'] text-3xl sm:text-4xl font-bold text-foreground">
              Alles, was du wissen musst
            </h2>
          </div>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 text-center bg-secondary/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <p className="text-xs font-semibold tracking-widest text-accent uppercase mb-4">Jetzt handeln</p>
          <h2 className="font-['Fraunces'] text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
            Dein Fall wartet nicht.
            <br />
            <span className="italic text-accent">Du auch nicht.</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10">
            Starte jetzt – kostenlos, anonym, ohne Anmeldung. In 2 Minuten weißt du, wo du stehst.
          </p>
          <button
            onClick={() => navigate("/fallcheck")}
            className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-primary-foreground rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/25 hover:-translate-y-1"
          >
            Fallcheck starten <ChevronRight className="w-5 h-5" />
          </button>
          <p className="mt-4 text-sm text-muted-foreground">Kostenlos · Anonym · Keine Anmeldung nötig</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <span className="font-['Fraunces'] font-semibold text-foreground">Rebell mit Herz</span>
            <div className="flex flex-wrap justify-center gap-5">
              <a href="https://www.rebellsystem.de" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">rebellsystem.de</a>
              <a href="/datenschutz" className="hover:text-foreground transition-colors">Datenschutz</a>
              <a href="/impressum" className="hover:text-foreground transition-colors">Impressum</a>
              <span>© 2026</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      <a
        href="https://wa.me/4915253482954"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-[#25D366] text-white rounded-full shadow-xl hover:bg-[#20bd5a] transition-all hover:-translate-y-1 hover:shadow-2xl"
        title="WhatsApp Kontakt"
      >
        <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        <span className="text-sm font-semibold hidden sm:block">Frage stellen</span>
      </a>
    </div>
  );
}
