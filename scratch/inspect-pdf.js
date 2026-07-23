const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function main() {
  try {
    const pdfBytes = fs.readFileSync('C:\\Users\\Onkar Desai\\Downloads\\Siddhi Yelavikar.pdf');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('PDF loaded successfully!');
    console.log('Page count:', pdfDoc.getPageCount());
    const pages = pdfDoc.getPages();
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      console.log(`Page ${i + 1}: Width = ${page.getWidth()}, Height = ${page.getHeight()}`);
    }
  } catch (err) {
    console.error('Error reading PDF:', err);
  }
}

main();
