# Apps Script — Entradas · Cumple de Cris 2026

Ticketing backend for `/eventos/social-bachata-cumple-cris-2026/`. Managed with
[clasp](https://github.com/google/clasp). Contract and gotchas:
`docs/knowledge/apps-script-ticketing.md`. Operator guide: `docs/user/eventos-runbook.md`.

## Prerequisites

```sh
npm i -g @google/clasp
clasp login   # use the Google account whose Gmail will send confirmations
```

Enable the Apps Script API once at https://script.google.com/home/usersettings.

## 1. Create the Sheet-bound project

From the **repo root**:

```sh
clasp create --type sheets --title "Entradas — Cumple de Cris 2026" --rootDir apps-script/tickets
```

This creates the Google Sheet + bound script, and writes `.clasp.json` **inside
`apps-script/tickets/`** (clasp puts it in `rootDir`). All later clasp commands
must run from `apps-script/tickets/`:

```sh
cd apps-script/tickets
```

`clasp create` may scaffold an `appsscript.json` — ours already exists and wins
on push. If it drops a stray `Code.gs`/`sheet` link file, keep only our files.

## 2. Push the code

```sh
clasp push -f
```

`-f` overwrites the remote manifest with our `appsscript.json` (timezone
America/Lima, web app: execute as me, access anyone).

## 3. Authorize + smoke test (once)

Open the editor:

```sh
clasp open
```

In the editor, run **`setup`** (creates the `Tickets` tab with bold, frozen
header — never edit the sheet structure by hand), then **`testDoPost`**. The
first run pops the authorization prompt (Spreadsheets + Send email scopes).
`testDoPost` should log `{"ok":true,"codes":["CRIS-001"]}`, a row should appear
in the Sheet, and a confirmation email should arrive. Delete the test row(s)
afterwards.

Alternative without the editor (requires `clasp run` setup with a GCP project):

```sh
clasp run setup
clasp run testDoPost
```

The editor route is simpler — use it.

## 4. Deploy the web app

```sh
clasp deploy --description "v1"
```

Output includes the deployment ID, e.g. `- AKfycb...xyz @1`. The public
endpoint is:

```
https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec
```

Paste that URL into `lib/events.ts` (`APPS_SCRIPT_URL`). It's public by design;
honeypot + deadline + Yape cross-check are the abuse controls.

Sanity check from a terminal (simple request, like the form sends):

```sh
curl -sL -X POST 'https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec' \
  -H 'Content-Type: text/plain;charset=utf-8' \
  --data '{"tickets":[{"fullName":"Curl Test","dni":"70123456"}],"email":"you@example.com","whatsapp":"999888777","yapeOperation":"12345678","website":""}'
```

(`-L` matters: `/exec` 302s to `script.googleusercontent.com`.) Delete the test
row after.

## 5. Redeploying after edits — same URL rule

**Never create a new deployment for code changes** — a new deployment gets a
NEW URL and would burn a Netlify site deploy. Instead, update the existing one:

```sh
clasp push -f
clasp deployments                                # note the existing <DEPLOYMENT_ID>
clasp deploy --deploymentId <DEPLOYMENT_ID> --description "v2"
```

(Editor equivalent: Deploy → Manage deployments → edit ✏️ → Version: New
version → Deploy.) The `/exec` URL stays the same.
