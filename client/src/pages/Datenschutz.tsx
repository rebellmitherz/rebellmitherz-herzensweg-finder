import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Datenschutz() {
  const [, navigate] = useLocation();

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <h1 className="font-['Fraunces'] text-4xl font-bold text-foreground mb-2">Datenschutzerklärung</h1>
        <p className="text-muted-foreground mb-10">Stand: März 2026</p>

        <div className="prose prose-sm max-w-none space-y-8 text-foreground">

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">1. Verantwortlicher</h2>
            <p className="text-muted-foreground leading-relaxed">
              Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:
            </p>
            <div className="mt-3 p-4 bg-secondary/40 rounded-xl text-sm text-muted-foreground">
              <p>Rebell mit Herz</p>
              <p>E-Mail: <a href="mailto:kontakt@rebellmitherz.de" className="text-primary hover:underline">kontakt@rebellmitherz.de</a></p>
              <p>Website: <a href="https://www.rebellsystem.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.rebellsystem.de</a></p>
            </div>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">2. Erhebung und Verarbeitung von Daten</h2>
            <p className="text-muted-foreground leading-relaxed">
              Beim Besuch dieser Website werden automatisch technische Daten durch den Webserver erfasst (sog. Server-Logfiles), insbesondere IP-Adresse, Datum und Uhrzeit des Zugriffs, aufgerufene Seite sowie der verwendete Browser. Diese Daten werden ausschließlich zur Sicherstellung des technischen Betriebs verwendet und nicht mit anderen Daten zusammengeführt.
            </p>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">3. Fallcheck und KI-Analyse</h2>
            <p className="text-muted-foreground leading-relaxed">
              Die im Rahmen des Fallchecks eingegebenen Texte und hochgeladenen Dokumente werden ausschließlich zur Erstellung der KI-Analyse verwendet. Die Eingaben werden <strong>nicht dauerhaft gespeichert</strong> und nach der Verarbeitung verworfen. Es werden keine personenbezogenen Daten aus den Eingaben extrahiert oder gespeichert.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Die Analyse erfolgt über die OpenAI API (OpenAI, L.L.C., 3180 18th St, San Francisco, CA 94110, USA). Dabei werden die Eingabedaten an OpenAI übermittelt. OpenAI verarbeitet diese Daten gemäß seiner eigenen Datenschutzrichtlinie. Weitere Informationen: <a href="https://openai.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">openai.com/privacy</a>.
            </p>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">4. E-Mail-Erfassung (MailerLite)</h2>
            <p className="text-muted-foreground leading-relaxed">
              Wenn du deine E-Mail-Adresse eingibst, um die vollständige Analyse zu erhalten, wird diese an MailerLite (UAB "MailerLite", J. Basanavičiaus 15, LT-03108 Vilnius, Litauen) übermittelt und dort gespeichert. Die Verarbeitung erfolgt auf Grundlage deiner ausdrücklichen Einwilligung (Art. 6 Abs. 1 lit. a DSGVO). Du kannst deine Einwilligung jederzeit widerrufen, indem du dich über den Abmeldelink in den E-Mails abmeldest.
            </p>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">5. Cookies</h2>
            <p className="text-muted-foreground leading-relaxed">
              Diese Website verwendet technisch notwendige Cookies, die für den Betrieb der Website erforderlich sind. Es werden keine Tracking- oder Marketing-Cookies eingesetzt.
            </p>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">6. Deine Rechte</h2>
            <p className="text-muted-foreground leading-relaxed">
              Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wende dich dazu an die oben genannte Kontaktadresse. Du hast außerdem das Recht, dich bei einer Datenschutzaufsichtsbehörde zu beschweren.
            </p>
          </section>

          <section>
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-3">7. Externe Links</h2>
            <p className="text-muted-foreground leading-relaxed">
              Diese Website enthält Links zu externen Websites (Calendly, WhatsApp, rebellsystem.de). Für die Datenschutzpraktiken dieser Drittanbieter übernehmen wir keine Verantwortung.
            </p>
          </section>

        </div>
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
