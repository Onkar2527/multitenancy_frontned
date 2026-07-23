const fs = require('fs');
const lines = fs.readFileSync('d:\\multitenancy\\multitenancy_frontend\\src\\app\\add-account\\form\\banks\\kumbhi-form\\kumbhi-form.component.html', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('form-page')) {
    console.log(`Line ${i + 1}: ${lines[i].trim()}`);
  }
}
