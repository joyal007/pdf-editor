import {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function ViewPdf() {
    const [pageCount, setPageCount] = useState(0); 
    const [index, setIndex] = useState(0);
    const {fileid} = useParams<{fileid: string}>();
    const [data, setData] = useState<ArrayBuffer | null>(null);
    function fetchPdf() {
        fetch(`http://localhost:8080/pdf/${fileid}`)
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
    useEffect(fetchPdf,[])
  return (
    <section>
        {data && (
          <Document
          className="flex flex-wrap justify-center"
          file={data}
          onLoadSuccess={({ numPages }) => setPageCount(numPages)}
          onLoadError={console.error}
          >
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
    </section>
  )
}

export default ViewPdf