const fs = require('fs');
let text = fs.readFileSync('client/src/pages/receipts/ReceiptPage.jsx', 'utf8');
let changed = text.replace(/\\`/g, '`').replace(/\\\$/g, '$');
fs.writeFileSync('client/src/pages/receipts/ReceiptPage.jsx', changed);
console.log('Done replacement in ReceiptPage');