import express from 'express';
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
const app = express();

app.get("/healthcheck",(req,res)=> {
    res.json({status: "ok"})
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

  
app.use(bodyParser.json());
app.use(cors())



app.get("/pdf/:filename",(req,res) => {
    var data =fs.readFileSync('./uploads/'+req.params.filename);
    console.log(typeof data, data)
    res.contentType("application/pdf");
    res.send(data);

})

app.get("/pdf",(req,res) => {
    res.json({files: uploadedFiles})
})

app.post("/upload", uploadStorage.single("file"), (req, res) => {
    console.log(req.file)
    uploadedFiles.push(req.file.filename)
    res.send("Single file upload success")
})

app.listen(8080,() => {
    console.log("server started @ port 8080")
})