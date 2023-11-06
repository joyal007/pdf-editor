import { FileText, PlusIcon } from "lucide-react";
import { useRef } from "react";
import { useGetAllPdf } from "@/hooks/getAllPdf";
import { Button } from "@/components/ui/button";
import RecentUploads from "@/components/RecentUploads";
import PdfViewer from "@/components/PdfViewer";
import { useLocation } from "react-router-dom";
import useLocalStorage from "@/hooks/localStorage";
import { file, localFile } from "@/types/files";

function Home() {
  const [pdf, setPdfs] = useLocalStorage("pdfs", []);

  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const fileId = queryParams.get("fileID");

  const uploadRef = useRef<HTMLInputElement>(null);
  const { files } = useGetAllPdf(pdf as localFile[]);

  async function handleUpload({ file }: { file: File }) {
    const dataForm = new FormData();
    dataForm.append("file", file as File);
    const resp = await fetch("http://localhost:8080/upload", {
      method: "POST",
      body: dataForm,
    });
    const data = await resp.json();
    setPdfs([...pdf as localFile[], { fileId: data.file.fileId } as localFile]);
  }

  return (
    <section className="px-4">
      <div className="flex w-full justify-between p-2">
        <div className="flex gap-2">
          <FileText strokeWidth={1} size={32} />
          <p className="text-xl my-auto font-medium tracking-wide">
            PDF - Splitter
          </p>
        </div>
        <input
          type="file"
          ref={uploadRef}
          accept=".pdf"
          className="w-0 h-0"
          onChange={(e) => {
            if (!e.target.files) return;

            const file = e.target?.files[0];
            // setUploadFile(file);
            handleUpload({ file });
          }}
        />
      </div>

      <div className="flex justify-center flex-col items-center mt-2">
        <h3 className="text-4xl font-medium ">Split PDF File</h3>
        <p className="text-lg text-slate-300 ">
          Seperate pages from your PDF file quickly
        </p>
        <Button className="mt-3" onClick={() => uploadRef?.current?.click()}>
          <PlusIcon size={24} />
          Upload
        </Button>
      </div>

      {/* <button onClick={fetchPdf}>read file</button> */}

      <RecentUploads files={files as file[]} />
      {fileId && <PdfViewer files={files as file[]} />}
    </section>
  );
}

export default Home;
