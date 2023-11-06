import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import { pdfjs } from "react-pdf";
import ViewPdf from "@/components/ViewPdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/view/:fileid" element={<ViewPdf/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App;
