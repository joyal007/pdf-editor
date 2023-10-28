import { DialogTrigger, Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import React, { useEffect } from 'react'
import { Button } from './ui/button'
import { FileEditIcon } from 'lucide-react'
import { Document, Page, pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function FileEdit({data, pageCount}) {
    const [selected, setSelected] = React.useState([]);

    useEffect(() => {
        console.log(pageCount)
        const rtrn =  Array.from({length: pageCount}).map((_, i) => i+1)
        console.log(rtrn)
        setSelected(rtrn)

    },[pageCount])
    // const [pageCount, setPageCount] = React.useState(0);
    console.log("data", data)

    const handleSelect = (page) => {
        if(selected.includes(page)) {
            setSelected(selected.filter((p) => p !== page))
        }else{
            const newSelected = [...selected, page]

            setSelected(newSelected.sort())
        }
    }
    console.log(selected)
  return (
    <Dialog>
        <DialogTrigger>
            <FileEditIcon strokeWidth={1} className="h-6 w-6"/>
        </DialogTrigger>
        <DialogContent>
            {/* <div>
        <Document
          className="flex flex-wrap justify-center"
          file={data}
          onLoadSuccess={({ numPages }) => {console.log(numPages);setPageCount(numPages)}}
          onLoadError={console.error}
        >
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
        </Document>
        </div> */}

<DialogHeader className="space-y-2">
      {/* <Document
          className="flex flex-wrap justify-center"
          file={data}
          onLoadSuccess={({ numPages }) => {console.log(numPages);setPageCount(numPages)}}
          onLoadError={console.error}
        > */}
            <div className=" space-y-2 border p-2 grid grid-cols-3 gap-2 content-center">
              {Array.from({ length: pageCount }).map((_, i) => (
                <div key={i}>
                <Page
                  className={`cursor drop-shadow-md hover:shadow-xl ${selected.includes(i+1) ? 'border-2 border-green-500' : ''}`}
                  onClick={() => handleSelect(i+1)}
                  pageNumber={i+1}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  width={140}
                />
                <p className="mt-2 text-center">{i + 1}</p>
                </div>
              ))}
            </div>
        {/* </Document> */}
    </DialogHeader>
    <DialogFooter>
      <Button type="submit">Confirm</Button>
    </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default FileEdit