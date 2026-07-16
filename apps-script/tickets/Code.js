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

const HEADER = [
  'Código', 'Nombre completo', 'DNI', 'Email', 'WhatsApp',
  'N° operación Yape', 'Verificado', 'Registrado',
];

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

    const tickets = (req.tickets || []).slice(0, MAX_TICKETS);
    const error = validate(req, tickets);
    if (error) return out({ ok: false, error: error });

    const codes = appendTickets(tickets, req);

    // Email failure must NOT fail the registration — rows are already written.
    try {
      MailApp.sendEmail({
        to: req.email.trim(),
        subject: '🎉 Estás en la lista — Social de Bachata · Cumple de Cris',
        htmlBody: buildEmail(tickets, codes),
      });
    } catch (mailErr) {
      console.error('sendEmail failed (registration kept): ' + mailErr);
    }

    return out({ ok: true, codes: codes });
  } catch (err) {
    console.error(err);
    return out({ ok: false, error: 'server' });
  }
}

/**
 * Validates the parsed request. Returns an error code string or null if valid.
 * @param {Object} req parsed request body
 * @param {Array<{fullName: string, dni: string}>} tickets already capped at MAX_TICKETS
 * @return {?string}
 */
function validate(req, tickets) {
  if (!tickets.length || !req.email || !req.yapeOperation) return 'validation';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(req.email).trim())) return 'validation';
  // 8-digit DNI, but also CE (9 digits) / passport — don't lock out foreigners
  if (tickets.some((t) => !t.fullName || !String(t.fullName).trim() ||
      !/^[A-Za-z0-9]{6,12}$/.test(String(t.dni).trim()))) return 'validation';
  return null;
}

/**
 * Appends one row per ticket under a script lock (serializes numbering).
 * Header row = 1, so the first ticket ever is CRIS-001.
 * @param {Array<{fullName: string, dni: string}>} tickets
 * @param {Object} req
 * @return {string[]} assigned ticket codes
 */
function appendTickets(tickets, req) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getOrCreateSheet();
    const start = sheet.getLastRow(); // header row = 1, so codes start at CRIS-001
    const now = new Date();
    const codes = tickets.map((t, i) => 'CRIS-' + String(start + i).padStart(3, '0'));
    sheet.getRange(start + 1, 1, tickets.length, HEADER.length).setValues(
      tickets.map((t, i) => [codes[i], t.fullName.trim(), String(t.dni).trim(),
        req.email.trim(), String(req.whatsapp || '').trim(),
        String(req.yapeOperation).trim(), '', now])
    );
    return codes;
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
  if (sheet.getLastRow() === 0) {
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
  };
  const result = doPost({ postData: { contents: JSON.stringify(payload) } });
  console.log(result.getContent()); // expect {"ok":true,"codes":["CRIS-00X"]}
}
