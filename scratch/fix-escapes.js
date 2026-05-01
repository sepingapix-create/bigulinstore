const fs = require('fs');
const path = require('path');

function unescapeFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // replace \` with `
  content = content.replace(/\\`/g, '`');
  // replace \$ with $
  content = content.replace(/\\\$/g, '$');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed', filePath);
}

unescapeFile('actions/stock-delivery.ts');
unescapeFile('app/admin/audit/page.tsx');
unescapeFile('app/admin/orders/[id]/page.tsx');
