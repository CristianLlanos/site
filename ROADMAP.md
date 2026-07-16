# ROADMAP — Events section + "Social de Bachata · Cumple de Cris"

Designed 2026-07-16 via /spec. Decisions and rationale in `docs/DECISIONS.md`.
Implementation knowledge in `docs/knowledge/`. Operator runbook in `docs/user/eventos-runbook.md`.

## Status — implemented 2026-07-16

Phase 1 (steps 1–16) is **done and verified end-to-end** on `main`: assets processed,
landing + ticket form live locally, Apps Script deployed (URL in `lib/events.ts`),
real purchases tested from a browser (codes CRIS-001…007 are test rows — **delete
them from the Sheet before launch**), SEO audited, `/simplify` + correctness review
applied. Remaining: **step 17 — launch merge `main` → `master` (~Jul 24–26)** and the
post-deploy smoke test. Netlify budget check before merging per CLAUDE.md.

Deferred until an event #2 exists (deliberate KISS, see DECISIONS §12+):
generate `.ics` from `lib/events.ts` at build time; per-event Apps Script URL;
move `components/events/ticketing.ts` into `lib/`; merge `.eventos-index__card`
into the shared card recipe.

## Vision

A new **unlisted events section** (`/eventos`) hosting immersive, poster-style landing
pages for dance events, with **self-serve ticketing** (Yape payment + native registration
form backed by Google Apps Script + Sheets). First event: Cristian's birthday bachata
social on **Wednesday, August 5, 2026**.

Audience: Lima dance-scene folks arriving from WhatsApp/Instagram links on their phones.
The page must sell the night and make buying a ticket take under two minutes, mobile-first.

## Event facts (single source of truth)

| Fact | Value |
|---|---|
| Name | Social de Bachata · Cumple de Cris |
| Slug / URL | `/eventos/social-bachata-cumple-cris/` |
| Date | Wednesday 2026-08-05 (Cris's birthday is Aug 6 — midnight birthday moment 🎂) |
| Doors | 8:00 pm |
| Zouk class | 9:30 pm, taught by Cristian Llanos, **included with entry** |
| Social | after class, bachata (+ zouk), until ~5:00 am ("hasta que el cuerpo aguante") |
| DJ | DJ Nathan |
| Venue | Centro de Convenciones Javier Prado, Av. Javier Prado Este 1179, **Tercer piso**, La Victoria, Lima |
| Venue caveat | Uber/maps by *name* mislocates it — always link by address/coordinates |
| Coordinates | -12.0892749, -77.0151988 |
| Google Maps | https://www.google.com/maps/place/Centro+de+Convenciones+Javier+Prado/@-12.0892179,-77.0179075,17z/data=!3m1!4b1!4m6!3m5!1s0x9105c87ebb8eb213:0xa908be93d1d0521!8m2!3d-12.0892232!4d-77.0153326!16s%2Fg%2F1ptxkll54 |
| Uber deep link | `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[latitude]=-12.0892749&dropoff[longitude]=-77.0151988&dropoff[nickname]=Centro%20de%20Convenciones%20Javier%20Prado&dropoff[formatted_address]=Av.%20Javier%20Prado%20Este%201179%2C%20La%20Victoria` |
| Presale price | **S/ 15** per person, online only, until **Aug 5, 6:00 pm** (America/Lima) |
| Door price | **S/ 20** — after 6:00 pm everything is door sales; no messages answered after 6 pm |
| Payment | Yape QR + Yape number **986 821 895** (Cristian Alberto Llanos Malca) |
| RSVP contact (secondary) | WhatsApp +51 986 821 895 ("¿Dudas?" link, not the main funnel) |
| Capacity | No cap. Max **5 tickets per purchase** (form sanity, adjustable) |
| Language | Spanish (es-PE), consistent with the site |
| Nav | Unlisted — in sitemap, not in top navigation |

## Source assets

| Asset | Source | Treatment |
|---|---|---|
| Cris hero photo | `/Users/cris/Downloads/cris.jpg` | Background removal (rembg), flattering color grade, rim glow — see Phase 1 |
| DJ Nathan artwork | `/Users/cris/Downloads/dj.jpg` | Background removal (near-white studio bg, easy), same unified glow treatment |
| Yape QR card | `/Users/cris/Downloads/IMG_9580.JPG` | Import as-is (already a designed card), just resize/optimize |

Processed images go to `public/img/eventos/cumple-cris-2026/`. Keep originals in `assets/`.

## Architecture

```
app/(events)/                      ← new route group, NO site nav (like (home))
  eventos/
    layout.tsx                     ← minimal layout, mini-footer linking home
    page.tsx                       ← events index (reads lib/events.ts)
    social-bachata-cumple-cris/
      page.tsx                     ← bespoke landing (Server Component shell)
components/events/
  TicketForm.tsx                   ← 'use client' — stepper form, POSTs to Apps Script
  DeadlineGate.tsx                 ← 'use client' — flips UI at Aug 5 18:00 Lima time
  ScrollReveal.tsx                 ← 'use client' — tiny IntersectionObserver wrapper
lib/events.ts                      ← typed event list (index page + shared facts)
public/eventos/cumple-cris-2026.ics  ← calendar file (20:00 → 05:00+1)
```

- Ticket backend: **Google Apps Script web app** (`doPost`) + Google Sheet. Full contract,
  CORS strategy, script skeleton and deployment steps: `docs/knowledge/apps-script-ticketing.md`.
- The Apps Script URL lands in the page via a constant in `lib/events.ts` (it's public by design).
- Cutoff is enforced in **two layers**: client (`DeadlineGate`, UX) and Apps Script (authoritative).
- Styling: `globals.css` per conventions, BEM `.evento__*` blocks, per-event accent
  palette via CSS custom properties scoped to the page root.

## Landing layout

```
┌──────────────────────────────────────────────────┐
│ HERO (100vh, animated warm gradient:             │
│ deep purple → magenta → amber, slow shift)       │
│  MIÉ 05 AGO · 8:00 PM         [Cris cutout,      │
│  SOCIAL DE BACHATA             rim glow,         │
│  🎂 CUMPLE DE CRIS             gentle float]     │
│  Clase de Zouk 9:30 PM incluida                  │
│  [Compra tu entrada — S/ 15]  [+ Calendario]     │
│  ↓ scroll hint                                   │
├──────────────────────────────────────────────────┤
│ LA NOCHE — vertical timeline, scroll-reveal      │
│  8:00 pm  Puertas abiertas                       │
│  9:30 pm  Clase de Zouk · Cristian Llanos        │
│ 10:15 pm  Social de bachata                      │
│ 12:00 am  ¡Feliz cumple, Cris! 🎂                │
│  hasta que el cuerpo aguante (~5 am)             │
├──────────────────────────────────────────────────┤
│ ENTRADAS — TicketForm stepper                    │
│  1) ¿Cuántos van? [- n +] → Total S/ 15×n        │
│  2) Yape QR + 986 821 895 → paga el total        │
│  3) Nombre completo + DNI por entrada,           │
│     email, WhatsApp, N° de operación Yape        │
│  [Registrar entradas]  → success: "Estás en      │
│  la lista 🎉 revisa tu correo"                   │
│  ⏰ "Preventa online hasta las 6:00 pm del 5/8.  │
│     Después, solo en puerta a S/ 20."            │
│  (after cutoff: DeadlineGate swaps this section  │
│   for "Venta online cerrada — solo en puerta.    │
│   No se responderán mensajes.")                  │
├──────────────────────────────────────────────────┤
│ DJ — split card: [DJ Nathan cutout, glow,        │
│  tilt-on-hover]  "EN CABINA · DJ NATHAN"         │
├──────────────────────────────────────────────────┤
│ LUGAR — Centro de Convenciones Javier Prado      │
│  Av. Javier Prado Este 1179, Tercer piso,        │
│  La Victoria                                     │
│  [Abrir en Google Maps]  [Pedir Uber]            │
├──────────────────────────────────────────────────┤
│ CTA FINAL — "Nos vemos en la pista" + entrada    │
│  CTA + ¿Dudas? WhatsApp link                     │
│  mini-footer → cristianllanos.com                │
└──────────────────────────────────────────────────┘
```

Effects (all static-export-safe): animated hero gradient, floating cutouts with rim glow,
scroll-reveal timeline, subtle equalizer-bars accent, gradient display type per site tokens.
Respect `prefers-reduced-motion`.

## SEO

- `generateMetadata()`: Spanish title/description, canonical, OG image
- `<JsonLd>` with `DanceEvent`: startDate `2026-08-05T20:00-05:00`, endDate
  `2026-08-06T05:00-05:00`, `Place` with full address + geo, two `Offer`s
  (S/ 15 `validThrough 2026-08-05T18:00-05:00`, S/ 20 door), performer DJ Nathan,
  organizer/instructor Cristian Llanos
- OG image 1200×630 via `/og-image` skill → `public/img/og/`
- Add `/eventos` + event URL to `app/sitemap.ts`
- Final `/seo-audit` pass before launch

## Phase 1 — implementation order

Session hygiene checklist (every session):
```
□ Implement steps
□ npm run build (static export must pass)
□ npm run lint
□ /simplify
□ Update docs/user/eventos-runbook.md if operator steps changed
□ Commit on main (NO deploy — master merge only at launch)
```

### Session A — Assets (steps 1–3)
1. Copy the 3 source images into `assets/eventos/` (originals) — sources listed above.
2. Background-remove `cris.jpg` and `dj.jpg` with `rembg` (`pipx run` or venv; `isnet-general-use` model works well for people). Flattering pass on Cris's cutout: slight warm grade, soft skin-friendly contrast — "make me look nice" is an explicit requirement.
3. Export optimized WebP (plus PNG fallback for cutouts w/ alpha) to `public/img/eventos/cumple-cris-2026/`; optimize the Yape QR (keep it crisp — it must scan from screens).

### Session B — Section + landing UI (steps 4–8)
4. `lib/events.ts` — typed event data + `APPS_SCRIPT_URL` placeholder constant.
5. `app/(events)/eventos/layout.tsx` + index `page.tsx` (simple list, one card).
6. Landing `page.tsx`: hero, timeline, DJ card, lugar (Maps + Uber buttons), CTA final — static sections, BEM styles in `globals.css`, per-event accent palette.
7. `ScrollReveal.tsx` + hero/gradient/glow/equalizer effects; `prefers-reduced-motion`.
8. `.ics` file + "+ Calendario" button.

### Session C — Ticketing (steps 9–12)
9. Apps Script per `docs/knowledge/apps-script-ticketing.md` (Cris deploys it, pastes URL into `lib/events.ts` — runbook §1).
10. `TicketForm.tsx` stepper: qty (max 5) → total → Yape QR + number → per-ticket name+DNI, buyer email/WhatsApp, N° operación → POST → success/error states. Honeypot field. Inline validation before submit.
11. `DeadlineGate.tsx` — client-side flip at 2026-08-05T18:00 America/Lima (compute against UTC-5 fixed offset; Peru has no DST).
12. End-to-end test against the real Apps Script (test row in Sheet, confirmation email received, cutoff simulated by temporarily moving the script's deadline).

### Session D — SEO + launch (steps 13–17)
13. `generateMetadata()` + `DanceEvent` JSON-LD + sitemap entries.
14. OG image via `/og-image` skill.
15. `/seo-audit` and fix findings.
16. `/code-review` the branch; fix findings.
17. Launch: merge `main` → `master` (~July 24–26; 1 deploy + 1 reserved for fixes; verify deploy budget per CLAUDE.md). Post-deploy smoke test: buy 1 real ticket end-to-end on a phone, verify Sheet row + email, then delete the test row.

Parallelism: Sessions A and B are independent (B can use placeholder images). C depends on B's scaffolding; D depends on all.

## Phase 2 (only if events become recurring)

- Promote events to a `content/events/` markdown content type with a shared landing template
- "Eventos" nav link + past-events archive
- Ticket QR codes / check-in tooling — **non-goal for this event** (printed list wins)

## Non-goals

- Payment gateway integration (Yape + manual verification is the model)
- Accounts, auth, or a database (Sheet is the database)
- QR-code tickets or door-scanning apps
- English version of event pages
- Nav visibility (unlisted by design for now)
