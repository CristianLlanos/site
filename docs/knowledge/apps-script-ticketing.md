# Apps Script ticketing backend — implementation guide

> **Deployed 2026-07-16** from `apps-script/tickets/` (clasp, account
> elcristianllanos@gmail.com). The `/exec` URL lives in `lib/events.ts`. To change the
> script: edit `apps-script/tickets/Code.js`, then from that directory
> `clasp push -f && clasp deploy --deploymentId <existing id> --description "vN"` —
> reusing the deploymentId keeps the URL. `doPost` self-heals the `Tickets` tab via
> `getOrCreateSheet()`, so `setup()` is only an authorization convenience.

The ticket form on `/events/social-bachata-cumple-cris-2026/` POSTs to a Google Apps Script
web app that validates, writes one row per ticket to a Google Sheet, and emails a
confirmation. This doc contains everything needed to build it without research.

Prior art: `~/Code/apps-script-cart` (Cris's old Apps Script + Sheets cart, deployed with
clasp). That project is an Apps Script–*hosted* UI using `google.script.run`; this one is
**cross-origin** (form on cristianllanos.com), which changes the transport — see CORS.

## CORS — the part that trips everyone up

Apps Script web apps can't set custom response headers, but deployments with access
"Anyone" DO return `Access-Control-Allow-Origin: *` on the final response. The catch is
the **preflight**: Apps Script cannot answer `OPTIONS`, so the request must qualify as a
"simple request" (no preflight):

- `POST` with `Content-Type: text/plain;charset=utf-8` (NOT `application/json`)
- No custom headers
- JSON goes in the body as a string; parse with `JSON.parse(e.postData.contents)`
- `fetch(url, { method: 'POST', body: JSON.stringify(payload), redirect: 'follow' })`
  — default content-type for a string body is text/plain; `redirect: 'follow'` matters
  because the `/exec` URL 302s to `script.googleusercontent.com`, which serves the JSON
  response with CORS headers.

Response: `ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)`.

## Request/response contract

Request (client → script):
```json
{
  "tickets": [{ "fullName": "Ana Pérez", "dni": "70123456" }],
  "email": "ana@example.com",
  "whatsapp": "999888777",
  "yapeOperation": "12345678",
  "website": "",           // honeypot — reject non-empty
  "purchaseId": "uuid",    // stable across retries — server dedupes replays
  "promoter": "duffoo"     // optional attribution slug from the URL fragment
}
```

Response: `{ "ok": true, "codes": ["CRIS-007"], "emailSent": true }` or
`{ "ok": false, "error": "closed" | "validation" | "server" }`.
Error copy shown by the form: `closed` → "La venta online cerró. Entradas en puerta a S/ 20."

Server validation (mirrored in `components/events/ticketing.ts`): 1–12 tickets
(oversize batches are REJECTED, not truncated), email format, whatsapp 9–12 digits,
yapeOperation + purchaseId required, fullName ≤ 80 chars, documento 6–12 alphanumeric.
Cell values are length-capped and formula-escaped (leading `=+@-` prefixed with `'`)
before writing. A replayed `purchaseId` returns the original codes with
`emailSent: true` and writes nothing. The confirmation email attaches the calendar
invite (`buildIcs()` — mirrors `public/events/cumple-cris-2026.ics`, keep in sync). `MAX_ROWS` (600) bounds scripted abuse. Group promo (6 pay 5, 12 pay 10 — one free per 5 paid) is client-side display math; the script never computes amounts, Cris verifies totals against Yape.

## Script skeleton

```js
const SHEET_NAME = 'Tickets';
const DEADLINE = new Date('2026-08-05T18:00:00-05:00'); // Lima, no DST
const MAX_TICKETS = 5;
const PRICE = 15;

function doPost(e) {
  const out = (obj) => ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.website) return out({ ok: false, error: 'validation' });       // honeypot
    if (new Date() > DEADLINE) return out({ ok: false, error: 'closed' }); // authoritative cutoff
    const tickets = (req.tickets || []).slice(0, MAX_TICKETS);
    if (!tickets.length || !req.email || !req.yapeOperation)
      return out({ ok: false, error: 'validation' });
    // 8-digit DNI, but also CE (9 digits) / passport — don't lock out foreigners
    if (tickets.some(t => !t.fullName || !/^[A-Za-z0-9]{6,12}$/.test(String(t.dni).trim())))
      return out({ ok: false, error: 'validation' });

    const lock = LockService.getScriptLock();   // serialize row appends + numbering
    lock.waitLock(10000);
    let codes;
    try {
      const sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME);
      const start = sheet.getLastRow();          // header row = 1 → first ticket = CRIS-001
      const now = new Date();
      codes = tickets.map((t, i) => 'CRIS-' + String(start + i).padStart(3, '0'));
      sheet.getRange(sheet.getLastRow() + 1, 1, tickets.length, 8).setValues(
        tickets.map((t, i) => [codes[i], t.fullName.trim(), String(t.dni).trim(),
          req.email.trim(), String(req.whatsapp || '').trim(),
          String(req.yapeOperation).trim(), '', now])   // col 7 = "Verificado" (manual ✓)
      );
    } finally {
      lock.releaseLock();
    }

    MailApp.sendEmail({
      to: req.email.trim(),
      subject: '🎉 Estás en la lista — Social de Bachata · Cumple de Cris',
      htmlBody: buildEmail(tickets, codes),  // names + codes + "muestra tu DNI en puerta"
                                             // + fecha/hora/dirección + Maps link
    });
    return out({ ok: true, codes });
  } catch (err) {
    return out({ ok: false, error: 'server' });
  }
}
```

Sheet header (row 1): `Código | Nombre completo | DNI | Email | WhatsApp | N° operación Yape | Verificado | Registrado | Compra | Promotor` (Compra = purchaseId for replay dedup; Promotor = attribution slug, malformed values degrade to empty rather than blocking a sale).

## Setup & deployment (Cris does this — see runbook)

1. sheets.new → name it "Entradas — Cumple de Cris 2026", tab `Tickets`, add the header row.
2. Extensions → Apps Script → paste the script (+ `buildEmail`).
3. Project Settings → timezone **America/Lima**.
4. Deploy → New deployment → Web app → Execute as **Me**, access **Anyone** → copy the `/exec` URL.
5. Paste the URL into `lib/events.ts` (`APPS_SCRIPT_URL`). It's public by design; the
   honeypot + deadline + Yape-code cross-check are the abuse controls.
6. First submission triggers an authorization prompt in the editor (Sheets + Mail scopes) —
   run `doPost` once from the editor with a test payload, or authorize via a test deploy.
7. **Redeploying after edits:** use "Manage deployments → edit → New version" to keep the
   same URL. A brand-new deployment generates a NEW URL (would require a site deploy).

Alternative: manage the script with clasp like the old cart (`npm i -g @google/clasp`,
`.clasp.json` with the script ID) — nice for versioning but optional for an 80-line script.

## Gotchas

- `MailApp` consumer Gmail quota ≈ 100 recipients/day — fine for party scale; if exceeded,
  registration still succeeds (wrap sendEmail in try/catch so email failure ≠ lost ticket).
  Actually wrap it: a quota error must not return `server` after rows were written.
- Apps Script `new Date()` honors the project timezone for formatting but compares
  instants correctly regardless; the ISO string with `-05:00` in `DEADLINE` is unambiguous.
- Don't rename the sheet tab without updating `SHEET_NAME`.
- Test cutoff by temporarily setting `DEADLINE` to a past date and redeploying (new
  version, same URL).
