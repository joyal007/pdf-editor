import { PDFDocument } from 'pdf-lib';
import fs from  'fs';
import { nanoid } from 'nanoid';
export async function splitPdf(pathToPdf, extractPages = [0]) {

    const docmentAsBytes = await fs.promises.readFile(pathToPdf);

    // Load your PDFDocument
    const pdfDoc = await PDFDocument.load(docmentAsBytes)

    const numberOfPages = pdfDoc.getPages().length;
    // Create a new "sub" document
    const subDocument = await PDFDocument.create();

    const copiedPage = await subDocument.copyPages(pdfDoc, extractPages)
    copiedPage.forEach(page => {
        subDocument.addPage(page);
    })
    let pdfBytes = await subDocument.save();
    const pdfName = nanoid(10)+".pdf"
    await writePdfBytesToFile("./uploads/"+pdfName, pdfBytes);
    return pdfName;
}

function writePdfBytesToFile(fileName, pdfBytes) {
    return fs.promises.writeFile(fileName, pdfBytes);
}

