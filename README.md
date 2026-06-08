# Pudgilly Riders – Website

Statische Website des Motorradclubs **Pudgilly Riders**, gebaut mit [Astro](https://astro.build).
Deployment erfolgt automatisch per GitHub Actions (rsync über SSH) auf das green.ch Webhosting.

## Seiten

| Seite      | Pfad          |
| ---------- | ------------- |
| Start      | `/`           |
| Über uns   | `/ueber-uns/` |
| Touren     | `/touren/`    |
| Galerie    | `/galerie/`   |
| Events     | `/events/`    |
| Kontakt    | `/kontakt/`   |

## Lokal entwickeln

Voraussetzung: Node.js 20+.

```bash
npm install      # Abhängigkeiten installieren
npm run dev      # Entwicklungsserver auf http://localhost:4321
npm run build    # Produktions-Build nach ./dist
npm run preview  # Build lokal ansehen
```

## Projektstruktur

```
src/
├── components/   # Header, Footer, PageHero
├── data/         # Touren- und Event-Daten (tours.ts, events.ts)
├── layouts/      # BaseLayout (Grundgerüst aller Seiten)
├── pages/        # Eine Datei pro Seite -> wird zur URL
└── styles/       # global.css (Designsystem / Farben / Buttons)
public/           # Statische Dateien (favicon.svg, robots.txt)
```

Inhalte wie Touren und Events pflegst du bequem in `src/data/`. Eigene Fotos für
die Galerie legst du unter `public/galerie/` ab und verlinkst sie in
`src/pages/galerie.astro`.

## Deployment

Bei jedem Push auf den `main`-Branch baut GitHub Actions die Seite und überträgt
den Inhalt von `dist/` per `rsync` auf den Webserver. Die Konfiguration liegt in
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

Benötigte GitHub-Secrets (siehe Abschnitt unten):

| Secret        | Beschreibung                                              |
| ------------- | -------------------------------------------------------- |
| `SSH_HOST`    | SSH-Hostname des green.ch Webhostings                    |
| `SSH_USER`    | SSH-Benutzername                                          |
| `SSH_KEY`     | Privater SSH-Schlüssel (vollständig, inkl. BEGIN/END)    |
| `DEPLOY_PATH` | Zielpfad auf dem Server (z. B. `/home/user/www/`)        |

> **Wichtig:** `rsync --delete` spiegelt das Zielverzeichnis exakt zum Build.
> Stelle sicher, dass `DEPLOY_PATH` ausschliesslich auf das Web-Root der Seite
> zeigt – nicht auf ein Verzeichnis mit anderen Dateien.

Die ausführliche Schritt-für-Schritt-Anleitung zum Einrichten der Secrets steht
in [`DEPLOY.md`](DEPLOY.md).
