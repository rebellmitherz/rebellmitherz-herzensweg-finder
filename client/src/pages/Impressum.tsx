import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Impressum() {
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
        <h1 className="font-['Fraunces'] text-4xl font-bold text-foreground mb-2">Impressum</h1>
        <p className="text-muted-foreground mb-10">Angaben gemäß § 5 TMG</p>

        <div className="space-y-8">

          <section className="p-6 bg-card border border-border rounded-2xl">
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-4 text-foreground">Anbieter</h2>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p className="font-semibold text-foreground">Rebell mit Herz</p>
              <p>Emilio Rebell</p>
              <p className="mt-3">
                E-Mail: <a href="mailto:kontakt@rebellmitherz.de" className="text-primary hover:underline">kontakt@rebellmitherz.de</a>
              </p>
              <p>
                Website: <a href="https://www.rebellsystem.de" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.rebellsystem.de</a>
              </p>
            </div>
          </section>

          <section className="p-6 bg-card border border-border rounded-2xl">
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-4 text-foreground">Haftungsausschluss</h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <p className="font-semibold text-foreground mb-1">Haftung für Inhalte</p>
                <p>
                  Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Die durch den Fallcheck bereitgestellten Informationen stellen keine Rechtsberatung dar und ersetzen diese nicht.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Haftung für Links</p>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
                </p>
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">Urheberrecht</p>
                <p>
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </div>
            </div>
          </section>

          <section className="p-6 bg-card border border-border rounded-2xl">
            <h2 className="font-['Fraunces'] text-xl font-semibold mb-4 text-foreground">Streitschlichtung</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
              <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://ec.europa.eu/consumers/odr/
              </a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
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
