const fs = require('fs');
const path = require('path');
const { PDFDocument } = require('pdf-lib');

const downloadsDir = 'C:\\Users\\Onkar Desai\\Downloads';

async function main() {
  try {
    const files = fs.readdirSync(downloadsDir)
      .map(file => {
        const filePath = path.join(downloadsDir, file);
        return {
          name: file,
          path: filePath,
          time: fs.statSync(filePath).mtime.getTime()
        };
      })
      .filter(file => file.name.toLowerCase().endsWith('.pdf'))
      .sort((a, b) => b.time - a.time);

    console.log(`Found ${files.length} PDFs in Downloads.`);
    const limit = Math.min(files.length, 3);
    for (let i = 0; i < limit; i++) {
      const file = files[i];
      console.log(`\n--- Inspecting PDF: ${file.name} ---`);
      try {
        const pdfBytes = fs.readFileSync(file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);
        console.log('Page count:', pdfDoc.getPageCount());
        const pages = pdfDoc.getPages();
        pages.forEach((page, index) => {
          console.log(`  Page ${index + 1}: Width = ${page.getWidth()} pt, Height = ${page.getHeight()} pt`);
        });
      } catch (err) {
        console.error(`  Error reading ${file.name}:`, err.message);
      }
    }
  } catch (err) {
    console.error('Error scanning downloads directory:', err);
  }
}

main();
