const fs = require('fs');
const lines = fs.readFileSync('d:\\multitenancy\\multitenancy_frontend\\src\\app\\add-account\\form\\banks\\dada-form\\dada-form.component.html', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('height') || line.includes('margin') || line.includes('padding')) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
