import express from 'express';
import fs from 'fs';
import "dotenv/config.js";
import cors from 'cors';
import { nanoid } from 'nanoid';
import File from './model/File.js';
import multer from 'multer';
import bodyParser from 'body-parser';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import './utils/db.js'
import { splitPdf } from "./helper/filesplit.js"

const app = express();
const __dirname = path.resolve();



app.get("/healthcheck", (req, res) => {
  res.json({ status: "ok" })
})

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname)
  },
})

const uploadStorage = multer({ storage: storage })

const uploadedFiles = []



app.use(express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors({ origin: "*" }))



app.post("/pdf/getall", async (req, res) => {
  const pdfs = req.body;
  try {
    let files = await File.find({
      $or: pdfs
    });
    // console.log(response)
    const response = []
    files.forEach((file, idx) => { 
      const data = fs.readFileSync('./uploads/' + file.fileName);
      response.push({ fileId: file.fileId, fileName: file.fileOriginalName, data: data })
    })
    console.log(response)
    return res.json({ response: response })
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Internal Server Error" })
  }
})

app.get("/pdf/:fileid", (req, res) => {
  const file = uploadedFiles.find(file => file.fileId === req.params.fileid)
  try {
    var data = fs.readFileSync('./uploads/' + file.fileName);
    res.contentType("application/pdf");
    return res.download(data, "joyal.pdf");
  } catch (err) {
    if(err.code === "ENOENT"){
      return res.status(404).json({ error: "File Not Found" })
    }
    return res.status(500).json({ error: "Internal Server Error" })
  }

})

app.get('/download/:id', async(req, res) => {
  const file = await File.findOne({fileId: req.params.id})
  const pdfPath = path.join(__dirname, 'uploads', file.fileName);
  console.log(pdfPath)
  return res.sendFile(pdfPath);
});


app.post("/split", async (req, res) => {
  const { fileId, pages } = req.body;
  const file = await File.findOne({ fileId: fileId })
  console.log(file.fileName)

  const pdfName = await splitPdf("./uploads/" + file.fileName, pages);
  const id = nanoid()
  const fileData = { fileId: id, fileName: pdfName, fileOriginalName: "Splitted-PDF.pdf" }
  await File.create(fileData)
  return res.json({ fileId: id })
})


app.post("/upload", uploadStorage.single("file"), async (req, res) => {
  const id = nanoid()
  const fileData = { fileId: id, fileName: req.file.filename, fileOriginalName: req.file.originalname }
  const file = await File.create(fileData)
  return res.json({ file })
})

app.listen(8080, () => {
  console.log("server started @ port 8080")
})