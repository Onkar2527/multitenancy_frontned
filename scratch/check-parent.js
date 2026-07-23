const fs = require('fs');
const html = fs.readFileSync('d:\\multitenancy\\multitenancy_frontend\\src\\app\\add-account\\form\\banks\\kumbhi-form\\kumbhi-form.component.html', 'utf8');

// Find all matches of <div class="form-page"> and see if they are inside structural directives
// We can parse the document hierarchy or do a simple block scan.
const lines = html.split('\n');
let indentStack = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('*ngIf') || line.includes('*ngFor')) {
    console.log(`Directive at line ${i + 1}: ${line.trim()}`);
  }
  if (line.includes('form-page')) {
    console.log(`Form page at line ${i + 1}: ${line.trim()}`);
  }
}
