// Post-export fix: add type="module" to the entry script tag
// Zustand's ESM build uses import.meta.env which requires module context
const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');

// Replace defer with type="module" on the entry script
html = html.replace(
  /(<script src="[^"]*entry-[^"]*\.js")\s*defer>/g,
  '$1 type="module">'
);

fs.writeFileSync(indexPath, html);
console.log('✅ Fixed script tag to type="module"');
