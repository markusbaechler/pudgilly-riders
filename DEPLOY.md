# Deployment einrichten – Schritt für Schritt

Diese Anleitung zeigt, wie der automatische Deploy von GitHub auf dein
**green.ch Webhosting** eingerichtet wird. Am Ende löst jeder Push auf `main`
automatisch einen Build und ein rsync-Deployment aus.

Du brauchst vier GitHub-Secrets: `SSH_HOST`, `SSH_USER`, `SSH_KEY`, `DEPLOY_PATH`.

---

## Schritt 1 – SSH-Schlüsselpaar erzeugen

GitHub Actions meldet sich mit einem **privaten** Schlüssel am Server an. Den
dazugehörigen **öffentlichen** Schlüssel hinterlegst du bei green.ch.

Öffne PowerShell und führe aus:

```powershell
ssh-keygen -t ed25519 -C "github-deploy-pudgilly" -f "$env:USERPROFILE\.ssh\pudgilly_deploy"
```

- Bei der Frage nach einer Passphrase einfach **Enter** drücken (leer lassen) –
  ein automatischer Deploy kann keine Passphrase eingeben.
- Es entstehen zwei Dateien:
  - `pudgilly_deploy`      → **privater** Schlüssel  → kommt in `SSH_KEY`
  - `pudgilly_deploy.pub`  → **öffentlicher** Schlüssel → kommt auf den Server

> ⚠️ Den privaten Schlüssel niemals ins Repository committen oder weitergeben.

---

## Schritt 2 – Öffentlichen Schlüssel bei green.ch hinterlegen

1. Melde dich im green.ch Control Panel an: <https://admin.servicehoster.ch>
2. Gehe zu deinem **Webhosting**-Produkt (WordPress Hosting M 3.0 / `H240943`).
3. Suche den Bereich **SSH-Zugang** bzw. **SSH/SFTP** und aktiviere SSH, falls
   noch nicht geschehen.
4. Hinterlege dort den **öffentlichen** Schlüssel. Inhalt anzeigen mit:

   ```powershell
   Get-Content "$env:USERPROFILE\.ssh\pudgilly_deploy.pub"
   ```

   Kopiere die komplette Zeile (beginnt mit `ssh-ed25519 …`) ins Feld für
   autorisierte SSH-Keys.

> Falls green.ch im Panel keine Key-Hinterlegung anbietet, findest du die
> Möglichkeit oft unter „SSH-Zugang verwalten“ oder du fügst den Key per
> bestehendem SSH-Login in `~/.ssh/authorized_keys` ein. Im Zweifel kurz beim
> green.ch-Support nachfragen – Stichwort „SSH-Key-Authentifizierung fürs
> Webhosting“.

---

## Schritt 3 – Die vier Werte ermitteln

Diese Angaben findest du im green.ch Control Panel beim Webhosting unter
**SSH-Zugang** / **Zugangsdaten**:

| Secret        | Was eintragen                                   | Beispiel                       |
| ------------- | ----------------------------------------------- | ------------------------------ |
| `SSH_HOST`    | SSH-Hostname (oder IP) des Servers              | `ssh.pudgilly.ch` o. `sXX.webhosting.green.ch` |
| `SSH_USER`    | Dein SSH-Benutzername                           | `pudgilly_ftp` o. ä.           |
| `DEPLOY_PATH` | Pfad zum Web-Root der Domain (mit `/` am Ende)  | `/home/pudgilly/www/`          |
| `SSH_KEY`     | Inhalt des **privaten** Schlüssels (komplett)   | siehe Schritt 4                |

Den **privaten** Schlüssel als Text anzeigen (zum Kopieren):

```powershell
Get-Content "$env:USERPROFILE\.ssh\pudgilly_deploy"
```

Kopiere **alles** – inklusive der Zeilen
`-----BEGIN OPENSSH PRIVATE KEY-----` und `-----END OPENSSH PRIVATE KEY-----`.

> **DEPLOY_PATH richtig wählen:** Das ist das Verzeichnis, dessen Inhalt im
> Browser unter `https://pudgilly.ch` erscheint (oft `www/`, `public_html/`
> oder `htdocs/`). Der Workflow nutzt `rsync --delete` – der Zielordner wird
> exakt zum Build gespiegelt. Zeige daher nur auf das Web-Root, nicht auf dein
> Home-Verzeichnis.

---

## Schritt 4 – Secrets in GitHub eintragen

1. Öffne dein Repository auf GitHub.
2. Klicke oben auf **Settings**.
3. In der linken Seitenleiste: **Secrets and variables → Actions**.
4. Klicke **New repository secret** und lege nacheinander diese vier an:

   | Name (genau so)| Wert                                               |
   | -------------- | -------------------------------------------------- |
   | `SSH_HOST`     | der Hostname aus Schritt 3                          |
   | `SSH_USER`     | der Benutzername aus Schritt 3                      |
   | `SSH_KEY`      | der **komplette private Schlüssel** aus Schritt 4   |
   | `DEPLOY_PATH`  | der Zielpfad aus Schritt 3 (z. B. `/home/pudgilly/www/`) |

   Bei jedem: Name eintragen, Wert einfügen, **Add secret**.

> Die Namen müssen **exakt** so geschrieben sein (Grossbuchstaben), weil der
> Workflow sie unter diesen Namen ausliest.

---

## Schritt 5 – Deployment auslösen

Sobald die Secrets gesetzt sind:

- **Automatisch:** Jeder Push auf `main` startet den Workflow.
- **Manuell:** Im Repo auf **Actions → „Build & Deploy“ → Run workflow**.

Den Fortschritt siehst du im **Actions**-Tab. Bei Erfolg liegt die Seite unter
`https://pudgilly.ch`.

---

## Fehlerbehebung

| Problem                                   | Ursache / Lösung                                                                 |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| `Permission denied (publickey)`           | Öffentlicher Key nicht (korrekt) auf dem Server hinterlegt → Schritt 2 prüfen.    |
| `Host key verification failed`            | `ssh-keyscan` konnte den Host nicht erreichen → `SSH_HOST` korrekt? Firewall?     |
| `rsync: command not found` (auf Server)   | green.ch-Server ohne rsync → Support kontaktieren oder auf `scp`-Deploy wechseln. |
| Seite leer / 403                          | `DEPLOY_PATH` zeigt aufs falsche Verzeichnis → echtes Web-Root verwenden.         |
| Schlüssel wird nicht akzeptiert           | Beim privaten Key wurde nicht der komplette Inhalt (inkl. BEGIN/END) kopiert.     |

### Server nutzt einen anderen SSH-Port?

Standard ist Port 22. Nutzt green.ch einen anderen Port, lege ein zusätzliches
Secret `SSH_PORT` an und ergänze im Workflow die rsync-Zeile um `-p <port>`:

```yaml
-e "ssh -i ~/.ssh/deploy_key -p ${{ secrets.SSH_PORT }} -o StrictHostKeyChecking=yes"
```

und beim `ssh-keyscan`:

```yaml
ssh-keyscan -p ${{ secrets.SSH_PORT }} -H "${{ secrets.SSH_HOST }}" >> ~/.ssh/known_hosts 2>/dev/null
```
