const fs = require('fs');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function main() {
  try {
    const downloadsDir = 'C:\\Users\\Onkar Desai\\Downloads';
    const files = fs.readdirSync(downloadsDir);
    const targetFile = files.find(f => f.toLowerCase().includes('form') && f.toLowerCase().endsWith('.pdf'));
    if (!targetFile) throw new Error('Target PDF containing Form not found');
    const filePath = require('path').join(downloadsDir, targetFile);
    console.log('Loading file:', filePath);
    const data = new Uint8Array(fs.readFileSync(filePath));
    const loadingTask = pdfjsLib.getDocument({ data });
    const pdf = await loadingTask.promise;
    console.log(`PDF Loaded. Total Pages: ${pdf.numPages}`);

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ').trim();
      console.log(`\n--- PAGE ${i} ---`);
      console.log(text.substring(0, 500) + (text.length > 500 ? '...' : ''));
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

main();
