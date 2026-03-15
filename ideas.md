# Design-Ideen: Herzensweg-Finder Funnel

## Kontext
Ein Fallcheck-Tool für Eltern in familienrechtlichen Konflikten. Die Zielgruppe ist emotional belastet, sucht Klarheit und Orientierung. Das Design muss Vertrauen, Kompetenz und Ruhe ausstrahlen – gleichzeitig aber auch Dringlichkeit und Handlungsbereitschaft erzeugen.

---

<response>
<idea>
**Design Movement:** Klinischer Minimalismus mit menschlicher Wärme (Inspired by Calm.com × Legal Tech)

**Core Principles:**
- Klare Hierarchie: Jede Seite hat genau eine Hauptaussage
- Vertrauen durch Reduktion: Weniger ist mehr – kein visuelles Rauschen
- Emotionale Sicherheit: Warme Erdtöne gegen die Kälte juristischer Themen
- Fortschritt als Motivation: Jeder Schritt fühlt sich wie ein Erfolg an

**Color Philosophy:**
- Primär: Tiefes Waldgrün `#1a3a2a` – Stabilität, Natur, Wachstum
- Akzent: Warmes Bernstein/Gold `#c8860a` – Wert, Handlung, Energie
- Background: Cremeweiß `#faf8f4` – Sauberkeit ohne Kälte
- Text: Dunkelbraun `#2d1f0e` – warm, lesbar, menschlich

**Layout Paradigm:**
- Asymmetrisches Single-Column-Layout mit großzügigem Whitespace
- Linke Seite: Inhalt/Text; Rechte Seite: visuelle Akzente oder Leerraum
- Progress-Indicator als vertikale Linie links, nicht als horizontale Bar

**Signature Elements:**
- Subtile Papier-Textur im Hintergrund (Grain-Overlay)
- Handgeschriebene Akzent-Schrift für emotionale Momente
- Grüne Checkmarks als Fortschritts-Marker

**Interaction Philosophy:**
- Jeder Klick fühlt sich bedeutsam an (sanfte Haptic-ähnliche Animationen)
- Kein Scrollen auf dem Funnel – alles passt in den Viewport
- Hover-States zeigen subtile Tiefe (box-shadow statt color-change)

**Animation:**
- Fade-in von unten (translateY 20px → 0) für neue Schritte
- Fortschrittsbalken füllt sich mit einer Ease-Out-Kurve
- Loading-Screen: Pulsierende Punkte mit Textrotation

**Typography System:**
- Heading: Playfair Display (serif, emotional, vertrauenswürdig)
- Body: Inter (klar, modern, gut lesbar)
- Akzent: Caveat (handgeschrieben, menschlich)
</idea>
<probability>0.08</probability>
</response>

<response>
<idea>
**Design Movement:** Moderne Sachlichkeit mit Wärme (Inspired by Notion × Headspace)

**Core Principles:**
- Professionelle Nüchternheit: Wie ein guter Anwalt – klar, direkt, kompetent
- Warme Neutralität: Beige-Töne statt kaltem Weiß
- Strukturierte Führung: Der Nutzer weiß immer, wo er ist
- Kontrast durch Typografie: Große Headlines, kleine Details

**Color Philosophy:**
- Primär: Dunkelblau-Grau `#1e2d3d` – Autorität, Vertrauen, Tiefe
- Akzent: Warmes Terrakotta `#c4622d` – Menschlichkeit, Energie, Dringlichkeit
- Background: Warmes Beige `#f5f0e8` – Einladend, nicht klinisch
- Sekundär: Helles Salbeigrün `#8aaa8c` – Beruhigung, Fortschritt

**Layout Paradigm:**
- Breite Hero-Section mit asymmetrischem Text-Bild-Split
- Funnel-Schritte als Karten-Stack (eine Karte pro Schritt, volle Breite)
- Sticky Progress-Bar oben mit Schritt-Nummern

**Signature Elements:**
- Diagonale Trennlinien zwischen Sektionen (clip-path)
- Große Anführungszeichen für Testimonials
- Terrakotta-Akzentlinie links neben wichtigen Texten

**Interaction Philosophy:**
- Klare Klick-Targets (große Buttons, viel Padding)
- Auswahl-Karten mit Hover-Lift-Effekt
- Smooth-Scroll zwischen Sektionen

**Animation:**
- Staggered Fade-in für Karten-Auswahl (0ms, 100ms, 200ms delay)
- Button-Press: Scale 0.97 auf click
- Analyse-Animation: Fortschritts-Balken mit realistischen Pausen

**Typography System:**
- Heading: Fraunces (serif, warm, charaktervoll)
- Body: DM Sans (modern, freundlich, gut lesbar)
- Mono: JetBrains Mono für Code/Daten-Elemente
</idea>
<probability>0.07</probability>
</response>

<response>
<idea>
**Design Movement:** Editorial Journalism × Legal Clarity (Inspired by The Atlantic × Linear)

**Core Principles:**
- Journalistische Klarheit: Fakten zuerst, Emotion folgt
- Kontrast als Werkzeug: Hell/Dunkel-Kontraste erzeugen Hierarchie
- Ehrlichkeit im Design: Kein Marketing-Bullshit, nur Substanz
- Geschwindigkeit: Der Nutzer kommt schnell zum Ergebnis

**Color Philosophy:**
- Primär: Fast-Schwarz `#0f1117` – Ernsthaftigkeit, Tiefe
- Akzent: Leuchtendes Smaragdgrün `#00a86b` – Hoffnung, Fortschritt, Lösung
- Background: Reines Weiß `#ffffff` mit dunklen Sektionen
- Muted: Hellgrau `#f4f4f5` für Karten-Hintergründe

**Layout Paradigm:**
- Dark Hero + Light Content-Sektionen (starker Kontrast)
- Funnel als modales Overlay über der Seite
- Ergebnis-Seite: Zeitungsartikel-Layout mit klarer Spaltenstruktur

**Signature Elements:**
- Dicke horizontale Trennlinien (border-top: 3px solid)
- Grüne Akzent-Badges für Status-Indikatoren
- Große Zahlen als visuelle Anker (01, 02, 03)

**Interaction Philosophy:**
- Tastatur-freundlich (Tab-Navigation, Enter-Submit)
- Keine unnötigen Animationen – nur zweckdienliche Übergänge
- Ergebnis erscheint wie ein Artikel, der sich aufbaut

**Animation:**
- Reveal-Animation: Text erscheint Zeile für Zeile (wie Schreibmaschine)
- Analyse: Echter Fortschrittsbalken mit Schritt-Labels
- Scroll-triggered Fade-in für Landingpage-Sektionen

**Typography System:**
- Heading: Syne (modern, geometrisch, stark)
- Body: Source Serif 4 (lesbar, journalistisch, vertrauenswürdig)
- UI: Geist (clean, technisch, präzise)
</idea>
<probability>0.09</probability>
</response>

## Gewähltes Design: Option 2 – Moderne Sachlichkeit mit Wärme

Fraunces + DM Sans, Beige-Hintergrund, Dunkelblau-Grau + Terrakotta-Akzente, Karten-Stack-Funnel.
