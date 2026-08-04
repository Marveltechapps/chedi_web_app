export function downloadReceipt(p, memberName) {
  const name = memberName || 'CHEDI Member'
  const html =
    '<!doctype html><html><head><meta charset="utf-8"><title>CHEDI Receipt ' + p.ref + '</title>' +
    '<style>body{font-family:Georgia,serif;color:#1c3b2c;max-width:640px;margin:40px auto;padding:0 24px}' +
    '.h{display:flex;justify-content:space-between;align-items:baseline;border-bottom:2px solid #1c3b2c;padding-bottom:14px}' +
    '.b{font-size:34px;font-weight:600;letter-spacing:.14em}.m{font-family:monospace;font-size:11px;color:#b98a2e;letter-spacing:.1em}' +
    'table{width:100%;border-collapse:collapse;margin-top:28px;font-family:Arial,sans-serif;font-size:14px}' +
    'td{padding:12px 0;border-bottom:1px solid #e4ded0}.r{text-align:right}.tot td{border-top:2px solid #1c3b2c;border-bottom:none;font-weight:700;font-size:18px;padding-top:16px}' +
    '.f{margin-top:36px;font-family:Arial,sans-serif;font-size:12px;color:#6f7566;line-height:1.6}</style></head><body>' +
    '<div class="h"><span class="b">CHEDI</span><span class="m">PAYMENT RECEIPT</span></div>' +
    '<table><tr><td>Receipt no.</td><td class="r">' + p.ref + '</td></tr>' +
    '<tr><td>Date</td><td class="r">' + p.date + '</td></tr>' +
    '<tr><td>Billed to</td><td class="r">' + name + ' · Member CHEDI-0500</td></tr>' +
    '<tr><td>Description</td><td class="r">' + p.label + '</td></tr>' +
    '<tr><td>Payment status</td><td class="r">Paid</td></tr>' +
    '<tr class="tot"><td>Amount paid</td><td class="r">' + p.amount + '</td></tr></table>' +
    '<div class="f">Thank you for supporting regenerative organic farming.<br>CHEDI Farm Club · Tamil Nadu, India · support@chedi.in<br>This is a system-generated receipt and does not require a signature.</div></body></html>'
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'CHEDI-Receipt-' + p.ref + '.html'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export function uid() {
  return 'x' + Math.random().toString(36).slice(2, 7)
}

export const TERMS_TEXT = [
  'Membership: A one-time ₹500 fee activates your CHEDI Farm Club membership and includes a complimentary welcome basket. Membership is non-transferable.',
  'Plot lease & subscription: Leasing a plot requires an annual subscription paid in advance. The lease grants you the harvest from a dedicated 600 sq ft plot, fully managed by CHEDI farmers.',
  'Deliveries: Weekly deliveries run for the plan period. Individual future deliveries may be cancelled up to 2 weeks in advance; the immediate next two weeks are locked as produce is already being harvested.',
  'Billing & renewal: Billing is manual. A renewal bill is generated at the end of the plan year and must be paid to continue deliveries. There is no automatic charge.',
  'Crop assurance: If a variety underperforms on your plot, CHEDI supplements the basket from adjacent plots on the same farm at no extra cost.',
  'Liability: CHEDI is not liable for delays caused by weather, natural events, or circumstances beyond reasonable control. These terms are governed by the laws of Tamil Nadu, India.',
]

export const PRIVACY_TEXT = [
  'Information we collect: Your name, mobile number, email and delivery address, provided during membership sign-up and used to fulfil deliveries and manage your account.',
  'How we use it: To assign and manage your plot, schedule weekly deliveries, process payments, and send service updates you have opted into.',
  'Payments: Card and net-banking details are processed by our secure payment partner and are never stored on CHEDI servers.',
  'Notifications: You control delivery, harvest and offer notifications from Settings → Notifications at any time.',
  'Data sharing: We do not sell your data. We share only what is necessary with delivery and payment partners to provide the service.',
  'Your rights: You may download your data or delete your account from Settings → Account. Contact support@chedi.in for any privacy request.',
]

export const CYCLES = [
  { start: 'Jul 2026', end: 'Jul 2027' },
  { start: 'Sep 2026', end: 'Sep 2027' },
  { start: 'Nov 2026', end: 'Nov 2027' },
  { start: 'Jan 2027', end: 'Jan 2028' },
  { start: 'Mar 2027', end: 'Mar 2028' },
]
