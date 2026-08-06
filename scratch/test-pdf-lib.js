const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');

async function test() {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 800]);
  
  // draw text
  page.drawText('Test Document Label', {
    x: 50,
    y: 750,
    size: 20,
    color: rgb(0, 0, 0)
  });
  
  // draw rectangle
  page.drawRectangle({
    x: 50,
    y: 700,
    width: 500,
    height: 30,
    color: rgb(0.9, 0.9, 0.9)
  });
  
  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync('scratch/test.pdf', pdfBytes);
  console.log('Saved scratch/test.pdf successfully!');
}

test().catch(console.error);
