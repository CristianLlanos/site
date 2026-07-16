/**
 * Ticketing backend — Social de Bachata · Cumple de Cris (2026-08-05).
 *
 * The form on https://cristianllanos.com/eventos/social-bachata-cumple-cris/
 * POSTs JSON as text/plain (simple request, no CORS preflight). This script
 * validates, appends one row per ticket to the 'Tickets' sheet, and sends a
 * confirmation email.
 *
 * Contract: docs/knowledge/apps-script-ticketing.md
 */

const SHEET_NAME = 'Tickets';
const DEADLINE = new Date('2026-08-05T18:00:00-05:00'); // Lima, no DST
const MAX_TICKETS = 5;
// Abuse guard: bounds how far a scripted caller can fill the sheet / burn the
// Gmail quota. Far above any realistic party turnout.
const MAX_ROWS = 600;

const HEADER = [
  'Código', 'Nombre completo', 'DNI', 'Email', 'WhatsApp',
  'N° operación Yape', 'Verificado', 'Registrado', 'Compra',
];
const PURCHASE_ID_COL = HEADER.indexOf('Compra');

const MAPS_URL = 'https://www.google.com/maps/place/Centro+de+Convenciones+Javier+Prado/@-12.0892179,-77.0179075,17z/data=!3m1!4b1!4m6!3m5!1s0x9105c87ebb8eb213:0xa908be93d1d0521!8m2!3d-12.0892232!4d-77.0153326!16s%2Fg%2F1ptxkll54';

/**
 * Web app entry point. Always returns JSON via ContentService:
 * { ok: true, codes: [...] } or { ok: false, error: 'closed'|'validation'|'server' }.
 */
function doPost(e) {
  const out = (obj) => ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
  try {
    const req = JSON.parse(e.postData.contents);
    if (req.website) return out({ ok: false, error: 'validation' });        // honeypot
    if (new Date() > DEADLINE) return out({ ok: false, error: 'closed' });  // authoritative cutoff

    const tickets = req.tickets;
    const error = validate(req, tickets);
    if (error) return out({ ok: false, error: error });

    const result = appendTickets(tickets, req);

    // A replayed purchase (retry after a lost response) was already emailed.
    let emailSent = result.duplicate;
    if (!result.duplicate) {
      // Email failure must NOT fail the registration — rows are already written.
      try {
        MailApp.sendEmail({
          to: String(req.email).trim(),
          subject: '🎉 Estás en la lista — Social de Bachata · Cumple de Cris',
          htmlBody: buildEmail(tickets, result.codes),
        });
        emailSent = true;
      } catch (mailErr) {
        console.error('sendEmail failed (registration kept): ' + mailErr);
      }
    }

    return out({ ok: true, codes: result.codes, emailSent: emailSent });
  } catch (err) {
    console.error(err);
    return out({ ok: false, error: 'server' });
  }
}

/**
 * Validates the parsed request. Returns an error code string or null if valid.
 * Mirrors components/events/ticketing.ts — keep both sides in sync.
 * @param {Object} req parsed request body
 * @param {Array<{fullName: string, dni: string}>} tickets
 * @return {?string}
 */
function validate(req, tickets) {
  // Reject (don't truncate) oversize batches: silent truncation would look
  // like success for tickets that were never registered.
  if (!Array.isArray(tickets) || tickets.length < 1 || tickets.length > MAX_TICKETS)
    return 'validation';
  if (!req.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.email).trim()))
    return 'validation';
  if (!/^\d{9,12}$/.test(String(req.whatsapp || '').trim())) return 'validation';
  if (!req.yapeOperation || !String(req.yapeOperation).trim()) return 'validation';
  if (!/^[A-Za-z0-9-]{8,64}$/.test(String(req.purchaseId || ''))) return 'validation';
  // 8-digit DNI, but also CE (9 digits) / passport — don't lock out foreigners
  if (tickets.some((t) => !t.fullName || !String(t.fullName).trim() ||
      String(t.fullName).trim().length > 80 ||
      !/^[A-Za-z0-9]{6,12}$/.test(String(t.dni).trim()))) return 'validation';
  return null;
}

/**
 * Trims, caps length, and defuses spreadsheet formula injection: a value
 * starting with =, +, @ or - would otherwise be interpreted by Sheets as a
 * formula when written via setValues.
 * @param {*} value
 * @param {number} maxLength
 * @return {string}
 */
function asCell(value, maxLength) {
  const s = String(value).trim().slice(0, maxLength);
  return /^[=+@-]/.test(s) ? "'" + s : s;
}

/**
 * Appends one row per ticket under a script lock (serializes numbering).
 * Header row = 1, so the first ticket ever is CRIS-001.
 * Idempotent per purchaseId: a replayed purchase (client retry after a lost
 * response) returns the codes already assigned instead of new rows.
 * @param {Array<{fullName: string, dni: string}>} tickets
 * @param {Object} req
 * @return {{codes: string[], duplicate: boolean}}
 */
function appendTickets(tickets, req) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getOrCreateSheet();
    const purchaseId = String(req.purchaseId).trim();
    const start = sheet.getLastRow(); // header row = 1, so codes start at CRIS-001

    if (start > 1) {
      const rows = sheet.getRange(2, 1, start - 1, HEADER.length).getValues();
      const existing = rows
        .filter((row) => row[PURCHASE_ID_COL] === purchaseId)
        .map((row) => row[0]);
      if (existing.length) return { codes: existing, duplicate: true };
      if (start - 1 + tickets.length > MAX_ROWS) throw new Error('MAX_ROWS guard hit');
    }

    const now = new Date();
    const codes = tickets.map((t, i) => 'CRIS-' + String(start + i).padStart(3, '0'));
    sheet.getRange(start + 1, 1, tickets.length, HEADER.length).setValues(
      tickets.map((t, i) => [codes[i], asCell(t.fullName, 80), asCell(t.dni, 20),
        asCell(req.email, 120), asCell(req.whatsapp, 20),
        asCell(req.yapeOperation, 40), '', now, purchaseId])
    );
    return { codes: codes, duplicate: false };
  } finally {
    lock.releaseLock();
  }
}

/**
 * Builds the confirmation email (Spanish, inline-styled HTML, dark-safe:
 * explicit background + text colors so dark-mode clients don't invert it).
 * @param {Array<{fullName: string, dni: string}>} tickets
 * @param {string[]} codes
 * @return {string} HTML body
 */
function buildEmail(tickets, codes) {
  const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const ticketRows = tickets.map((t, i) =>
    '<div style="padding:10px 14px;margin:6px 0;background-color:#f4f0fa;border-radius:8px;color:#1a1a2e;">' +
      '<span style="font-family:monospace;font-weight:bold;color:#6b3fa0;">' + esc(codes[i]) + '</span>' +
      ' &nbsp;·&nbsp; ' + esc(t.fullName.trim()) +
    '</div>'
  ).join('');

  return (
    '<div style="background-color:#ffffff;color:#1a1a2e;font-family:Arial,Helvetica,sans-serif;' +
        'font-size:16px;line-height:1.6;max-width:560px;margin:0 auto;padding:24px;">' +
      '<h1 style="color:#6b3fa0;font-size:22px;margin:0 0 8px;">🎉 ¡Estás en la lista!</h1>' +
      '<p style="margin:0 0 16px;color:#1a1a2e;">Gracias por tu compra. Aquí ' +
        (tickets.length === 1 ? 'está tu entrada' : 'están tus entradas') +
        ' para la <strong>Social de Bachata · Cumple de Cris</strong>:</p>' +
      ticketRows +
      '<div style="margin:20px 0;padding:16px;background-color:#f9f7fc;border-radius:8px;color:#1a1a2e;">' +
        '<p style="margin:0 0 6px;"><strong>📅 Miércoles 5 de agosto, 8:00 pm</strong></p>' +
        '<p style="margin:0 0 6px;">💃 Clase de Zouk a las 9:30 pm — <strong>incluida con tu entrada</strong>.</p>' +
        '<p style="margin:0;">📍 Centro de Convenciones Javier Prado — Av. Javier Prado Este 1179, ' +
          'Tercer piso, La Victoria<br>' +
          '<a href="' + MAPS_URL + '" style="color:#6b3fa0;">Ver en Google Maps</a></p>' +
      '</div>' +
      '<p style="margin:0 0 12px;color:#1a1a2e;"><strong>El día del evento, muestra tu DNI en puerta</strong> ' +
        'y di tu nombre — con eso entras. No necesitas imprimir nada.</p>' +
      '<p style="margin:0 0 12px;color:#1a1a2e;">Verificaremos tu pago con el número de operación de Yape. ' +
        'Solo te escribiremos por WhatsApp si algo no cuadra — si no recibes mensaje, todo está en orden.</p>' +
      '<p style="margin:24px 0 0;color:#1a1a2e;">¡Nos vemos en la pista! 🕺<br>Cris</p>' +
    '</div>'
  );
}

/**
 * Idempotent: returns the 'Tickets' tab, creating it with a bold frozen
 * header if missing. doPost calls this, so registrations never depend on a
 * human having run setup() first. Safe to call repeatedly.
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActive();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    const first = ss.getSheets()[0];
    // Rename the default empty tab instead of leaving a stray 'Sheet1'.
    sheet = (ss.getSheets().length === 1 && first.getLastRow() === 0)
      ? first.setName(SHEET_NAME)
      : ss.insertSheet(SHEET_NAME);
  }
  // Covers both the empty sheet and a header written by an older version
  // with fewer columns.
  if (sheet.getLastRow() === 0 || sheet.getLastColumn() < HEADER.length) {
    sheet.getRange(1, 1, 1, HEADER.length).setValues([HEADER]).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * One-time setup entry point for the editor: ensures the 'Tickets' tab and
 * triggers the Sheets authorization prompt. Safe to re-run.
 */
function setup() {
  getOrCreateSheet();
  console.log('setup done: sheet "' + SHEET_NAME + '" ready');
}

/**
 * Smoke test: calls doPost with a fake payload. Running it from the editor
 * triggers the authorization prompt (Sheets + Mail scopes) in one click.
 * Uses a deadline-safe valid payload; writes real rows — delete them after.
 */
function testDoPost() {
  const payload = {
    tickets: [{ fullName: 'Prueba Uno', dni: '70123456' }],
    email: Session.getActiveUser().getEmail() || 'test@example.com',
    whatsapp: '999888777',
    yapeOperation: '12345678',
    website: '',
    purchaseId: 'test-' + Utilities.getUuid(),
  };
  const result = doPost({ postData: { contents: JSON.stringify(payload) } });
  console.log(result.getContent()); // expect {"ok":true,"codes":["CRIS-00X"]}
}
