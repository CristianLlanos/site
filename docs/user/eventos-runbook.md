# Runbook — Social de Bachata · Cumple de Cris (2026-08-05)

Operator guide for Cris. The page sells tickets by itself; this is what YOU do.

## 1. One-time setup — DONE 2026-07-16 ✓

Already completed via clasp under elcristianllanos@gmail.com:
- Sheet: https://drive.google.com/open?id=1NpH36v0rkb-Ayw80_lS0TIXX2FkC-1ch1bou0BYfw_M
- Script editor: https://script.google.com/d/1Mz6vRgsJdiv6PgtQwW1mJqnvZ3JZAuwbpj_wfdx8rtTXWBY8P3KPyjZf/edit
- Web app deployed; URL wired into `lib/events.ts`; end-to-end verified (rows + emails).

Still yours to do:
1. **Delete the test rows CRIS-001…007** from the Sheet before launch.
2. After the production deploy: buy one real ticket from your phone (Yape yourself
   S/ 15), check the whole loop, then delete that row too.

## 2. While sales are open (Jul 24 → Aug 5, 6:00 pm)

- **Daily (2 min):** open the Sheet, compare each purchase's "N° operación Yape" against
  your Yape history; mark ✓ in **Verificado** when the money matches. Rows of one purchase
  share the same **Compra** id. Expected amount = (entradas − ⌊entradas/6⌋) × S/ 15 —
  the group promo gives 1 free per 5 paid (6 → S/ 75, 12 → S/ 150).
- Mismatch or missing payment → WhatsApp the buyer (their number is in the row).
- Share the page link everywhere: `https://cristianllanos.com/eventos/social-bachata-cumple-cris/`
- You do NOT need to answer "how do I buy" messages — the page is the answer.

## 3. Aug 5, event day

- **6:00 pm:** the page flips to "venta cerrada" by itself, and the script rejects late
  submissions. Nothing to do. (Belt & suspenders: you can also open the Apps Script and
  check; but the deadline is in the code.)
- **Before leaving:** final verification pass on the Sheet, then **print it** sorted by
  name (File → Print, or export to PDF). Columns that matter at the door: Código, Nombre,
  DNI, Verificado.
- **At the door:** attendee says their name, shows DNI, you check the list. Unverified
  payment → they pay S/ 20 like door price (their word vs your Yape history — your call).
- Door sales: cash/Yape S/ 20, add to a blank page on the printout.

## 4. If something breaks

| Symptom | Fix |
|---|---|
| Form shows "error del servidor" | Check Apps Script → Executions for the failing run. Buyers can still Yape + WhatsApp you manually — add rows to the Sheet by hand. |
| Confirmation emails stop | Gmail daily quota (~100). Registrations still work; emails just skip. No action needed. |
| Need to change price/deadline/copy in the script | Edit script → Deploy → **Manage deployments → edit → New version** (keeps the same URL). Never "New deployment" — that changes the URL and needs a site deploy. |
| Page itself needs a fix | One reserved Netlify deploy in the budget (see CLAUDE.md). |

## 5. After the event

- Keep the Sheet (attendee contact list for the next social 😉).
- Consider archiving the page or adding an "evento pasado" banner — cheap change, batch it
  with the next deploy, never a dedicated one.
