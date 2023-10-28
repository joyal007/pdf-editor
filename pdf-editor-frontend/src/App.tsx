import { FileEditIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import FileEdit from "./components/FileEdit";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// setOptions({
//   workerSrc: "/js/worker.pdf.js"
// });

function App() {
  const [pageCount, setPageCount] = useState(0); 
  const [select, setSelect] = useState(null)
  const [index, setIndex] = useState(0);
  const [data, setData] = useState<ArrayBuffer | null>(null);

  const [files, setFiles] = useState<string[] | null>(null)

  function fetchPdf() {
    fetch(`http://localhost:8080/pdf/${select}`)
      .then((res) => {
        typeof res;
        return res.arrayBuffer();
      })
      .then((blob) => {
        console.log(blob);
        setData(blob);
        // const url = window.URL.createObjectURL(blob);
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = 'test.pdf';
        // a.click();
      });
  }
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  useEffect(() => {
      fetch("http://localhost:8080/pdf").then(res => res.json()).then(data => {
        setFiles(data.files)
      })
  },[])

  async function handleUpload() {
    const dataForm = new FormData();
    dataForm.append("file", uploadFile as File);
    const resp = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: dataForm,
    })
    console.log(resp)
    const data = await resp.text();
    console.log(data)
  }

  return (
    <>
    <div>
      {files && files?.map(file => <p key={file} className={`${file == select?"text-red-400": "text-black"}`} onClick={() => setSelect(file)}>{file}</p>)}
    </div>
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => {
          const file = e.target?.files[0];
          setUploadFile(file)
          // const reader = new FileReader();

          // reader.onload = () => {
          //   const pdf = reader.result;
          //   setData(pdf);
          // };

          // reader.readAsDataURL(file);
        }}
      />
      <button onClick={handleUpload}>Upload</button>
      <button onClick={fetchPdf}>read file</button>
      {data && (
        <Document
        className="flex flex-wrap justify-center"
        file={data}
        onLoadSuccess={({ numPages }) => setPageCount(numPages)}
        onLoadError={console.error}
        >
          <FileEdit data={data} pageCount={pageCount} />
          <Page
            className="my-0 mx-2"
            pageNumber={index + 1}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
          {
            <div className=" cursor-pointer sticky right-0 top-0 w-40 h-screen overflow-y-auto space-y-2 border p-2 border-green-300">
              {Array.from({ length: pageCount }).map((_, i) => (
                <div key={i}>
                <Page
                  className={`cursor drop-shadow-md hover:shadow-xl ${i == index ? 'border-2 border-green-500' : ''}`}
                  onClick={() => setIndex(i)}
                  pageNumber={i+1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={140}
                />
                <p className="mt-2 text-center">{i + 1}</p>
                </div>
              ))}
            </div>
          }
        </Document>
      )}
    </>
  );
}

export default App;
