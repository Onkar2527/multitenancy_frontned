const fs = require('fs');
const files = fs.readdirSync('C:\\Users\\Onkar Desai\\Downloads')
  .filter(f => f.toLowerCase().endsWith('.pdf'));
console.log('All PDFs:', files);
