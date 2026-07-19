# Decisions log

## 2026-07-16 — Events section + Cumple de Cris landing (/spec session)

### 1. Events live in an unlisted `(events)` route group, not the nav
Immersive poster-style pages without the site nav (like `(home)`). `/events` exists and
is in the sitemap but gets no nav link — the audience arrives via WhatsApp/Instagram
links. Nav promotion deferred until events are recurring.
*Alternatives:* nav item now (rejected: one event doesn't justify it), markdown content
type like blog (rejected: this landing is too bespoke; revisit at event #2).

### 2. Event name: "Social de Bachata · Cumple de Cris"
Personal and searchable; slug `/events/social-bachata-cumple-cris-2026`.
*Alternatives:* "Cris B-Day Social", "Zouk & Bachata Night".

### 3. Ticketing = native form + Google Apps Script + Google Sheet
User proposed it (prior art: `~/Code/apps-script-cart`). Keeps UX on-brand, free, and the
Sheet doubles as the printable door list. New script is a single `doPost` (~80 lines) —
deliberately NOT reusing the old cart's container/router architecture (one endpoint).
*Alternatives:* embedded Google Form (rejected: off-brand iframe, file upload requires
Google sign-in), Tally (rejected: third party, uncertain free-tier limits), WhatsApp-only
(rejected: makes Cris's phone the bottleneck and the sheet manual).

### 4. Payment proof = Yape "N° de operación", not a screenshot upload
Typed code avoids file uploads entirely (no sign-in friction, no storage), and Cris can
cross-check codes against his Yape history. Yape QR (`IMG_9580.JPG`) + number 986 821 895
shown on the page; total computed as S/ 15 × tickets.

### 5. Per-ticket data: full name + DNI; per-purchase: email, WhatsApp, N° operación
DNI added at Cris's request (door identification). Field accepts DNI/CE/passport
(6–12 alphanumeric) so foreigners in the dance scene aren't locked out — form label:
"DNI / CE / Pasaporte". One Sheet row per ticket
(person), not per purchase — the printout is a door list of people. Max 5 tickets per
purchase; no total sales cap.

### 6. 6:00 pm cutoff enforced in two layers
Client `DeadlineGate` flips the section at 2026-08-05 18:00 Lima (UX, no deploy needed);
Apps Script rejects late submissions (authoritative — client clocks lie). Copy after
cutoff: door sales S/ 20 only, no messages answered. Peru has no DST → fixed UTC-5 math
is safe.

### 7. Confirmation = automatic email via MailApp
"Estás en la lista 🎉" with names + door instructions. Free, within consumer Gmail's
~100/day quota (party scale). No QR tickets — printed list at the door wins (matches
Cris's stated event-day workflow).

### 8. Venue linked by address/coordinates, never by name
Uber mislocates "Centro de Convenciones Javier Prado" by name. Two buttons: Google Maps
(exact place URL) + Uber universal link (`https://m.uber.com/ul/?action=setPickup...`
with dropoff coords) — universal link chosen over the `uber://` scheme because it works
without the app installed and on desktop.

### 9. Pricing: S/ 15 presale (online, until 6 pm day-of) / S/ 20 door
Zouk class included with entry. Both offers go in the `DanceEvent` structured data.

### 10. Hero photos: cutouts with unified treatment
`cris.jpg` (busy night background) and `dj.jpg` (studio background) don't match; both get
background removal (local `rembg` — free, nothing uploaded to third parties) + shared
rim-glow/warm-grade treatment. Explicit requirement on the Cris cutout: flattering edit.

### 11a. Implementation decisions (2026-07-16 build session)
- **Footer + `.site-container` moved from the root layout into the `(home)`/
  `(navigation)` group layouts** so the `(events)` group is naturally full-bleed and
  footer-less — replaced two `:has()` CSS hacks and a `100vw` breakout that broke on
  old in-app browsers. `not-found.tsx` carries its own container + footer.
- **ESLint set up properly** (flat config `eslint.config.mjs` + `eslint-config-next@15`,
  `lint: eslint .`): `next lint` had never been configured and did not run.
  `@next/next/no-img-element` disabled globally — static export ships plain `<img>` by design.
- **Hero animation split for perf**: gradient animated via `transform` on an oversized
  layer (not `background-position`); float animation on the figure wrapper with the glow
  filter on `<picture>` (filter+transform on one element re-rasterizes per frame; filter
  on the img gets clipped into a visible box by the bottom-fade mask).
- **Apps Script is self-healing**: `doPost` creates the `Tickets` tab if missing —
  registrations never depend on someone having run `setup()`.
- **Success panel renders a submit-time snapshot** of tickets+codes; live form state can
  change while the request is in flight and would misalign codes and names.
- **Test registrations CRIS-001…007** exist in the Sheet from end-to-end verification —
  delete before launch.

### 11b. Codex review hardening (2026-07-16)
- **Idempotent purchases**: the form sends a `purchaseId` stable across retries; the
  script returns the already-assigned codes for a replay instead of duplicating rows.
- **Sheet formula injection defused** (`asCell`: trim, length cap, `'`-prefix leading
  `=+@-`) and server validation now mirrors the client fully (reject >5 tickets instead
  of truncating, whatsapp 9–12 digits) plus a `MAX_ROWS` (600) abuse guard.
- **Honest success copy**: server returns `emailSent`; if the email failed (quota), the
  UI says "guarda una captura de estos códigos" instead of "revisa tu correo".
- **Submit-time cutoff check + 30s fetch timeout** so the form can't hang in
  "Registrando…" or fire a request that will bounce.
- **Reveal effect is now progressive enhancement**: content visible by default; JS hides
  only below-fold elements before animating them in (no-JS/no-IntersectionObserver
  visitors get a plain page). Price-bearing CTAs (hero, final) swap to door-price copy
  after the cutoff via DeadlineGate.
- **Accepted risks (documented, not bugs)**: no captcha/rate-limiting on the public
  endpoint (honeypot + manual Yape verification + MAX_ROWS bound it at party scale);
  the unlisted /events index shows presale price until the post-event cleanup.

### 11c. Flyer alignment (2026-07-16, after the official flyer arrived)
The flyer is the source of truth and superseded three facts: Zouk class at **9:00 pm**
(was 9:30) now taught by **Cris + Xio**; "cantamos el cumple" at **1:00 am** (was
midnight). Updated everywhere: landing, JSON-LD, metadata, `.ics`, confirmation email.
Visual overhaul to the flyer palette (cosmic blue-black, champagne gold, ember, electric
blue — replaces purple/magenta). New hero photo (`cris2.jpg`) with the shirt recolored
brown→teal to match the flyer (Cris chose this over keeping the brown). Xio gets a
"La clase" card mirroring the DJ card (hero stays solo Cris — Cris's call). Venue
croquis (Maps screenshot) added to Lugar, clickable to Google Maps.

### 11d. Flyer background texture + group promo (2026-07-16)
- **Flyer texture in the web**: `bg-cosmic.webp` composed in PIL from the flyer's
  text/people-free edge crops (blue smoke, golden arc, sparks) with feathered masks and
  a luminance→alpha channel, so the hero's animated gradient breathes through it. Layered
  as a real `.evento__hero-bg` div placed before the figure in the DOM (a `::after` at the
  same z-index paints over child divs — it draped smoke across Cris's face). The same
  texture closes the page as a full-bleed `.evento__final` band. Rejected: blurred whole
  flyer as background (title/people stayed legible, looked like a watermark).
- **Group promo**: max 12 tickets per purchase; 1 free per 5 paid → total =
  (qty − ⌊qty/6⌋) × S/ 15 (6 pay 75, 12 pay 150). Promo math lives in `lib/events.ts`
  (`presaleTotal`/`freeTicketsFor`) and is display-only — the script (v6, MAX_TICKETS 12)
  never computes amounts; Cris verifies totals against Yape per purchase (rows share the
  Compra id).

### 11e. Uber universal link everywhere (web + email) — final
The uber:// scheme was tried first (Cris's call) but Gmail refuses to linkify app
schemes (confirmed broken in testing), so the email moved to the
`https://m.uber.com/ul/` universal link — and then the web followed for consistency
(Cris's call). The universal link opens the app directly when installed and falls
back to Uber web otherwise, matching decision 8's original choice. Cris's variant
used `pickup[latitude]=my_location` — normalized to the documented `pickup=my_location`.

### 11f. Slug renamed to include the year (2026-07-16, pre-launch)
`/eventos/social-bachata-cumple-cris` → `/events/social-bachata-cumple-cris-2026`
(Cris's call — leaves room for future editions). Renamed before any deploy, so no
redirect needed; sitemap/canonical/JSON-LD/breadcrumbs all derive from
`lib/events.ts` and followed automatically.

### 11g. Section path in English: /eventos → /events (2026-07-16, Cris's call)
URL coherence with /blog, /projects, /credits. Renamed pre-launch (no redirect):
route dir, `public/events/` (.ics), `public/img/events/` assets, sitemap, canonicals,
breadcrumbs, OG footer label. Content stays Spanish; internal names that are not URLs
(`.eventos-*` CSS classes, `docs/user/eventos-runbook.md`, `assets/eventos/`) keep
their names, as does the `eventos-en-kotlin` blog slug.

### 11h. Final flyer rebrand (2026-07-19)
The near-final flyer set an explicit palette — negro azulado #050A12, azul petróleo
#073B4C, azul marino #071B33, dorado cobrizo #D7A36A, ámbar tenue #B87333 — applied
across the landing, form, footer, OG image, and the confirmation email (Apps Script
v10, warm cream boxes + copper accents). The new clean background art (Fondo.jpg,
no text/people) replaced the composed texture: opaque webp (47KB vs 400KB+ with
alpha), used as the hero scene with a compositor-only "breathe" scale animation
(the old animated gradient stayed only as a load-time safety net) and as the final
band. Facts from the flyer: **doors 8:30 pm** (was 8:00 — cascaded to startDate,
timeline, .ics, email, OG) and **Bachata Club Lima-Perú** credited in Lugar and as
co-organizer in the JSON-LD.

### 12. Launch ~July 24–26 on one deploy
Netlify cycle reset July 14 (fresh 20 deploys). Build everything on `main`; single
`master` merge to launch + 1 reserved fix deploy. End time for schema/.ics: 5:00 am
(messaging stays open-ended: "hasta que el cuerpo aguante").
