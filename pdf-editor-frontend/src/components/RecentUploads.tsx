import { Document, Page } from "react-pdf";
import { Link } from "react-router-dom";
import { file } from "@/types/files";

function RecentUploads({ files }: { files: file[] }) {
  return (
    <section className="w-full">
      <h1 className=" text-base">Recent Uploads</h1>
      <div className=" w-full grid grid-cols-1 h-full md:grid-cols-4 gap-2 md:gap-3 justify-center md:justify-start mt-5">
      {files?.map((file) => (
        <Link
        to={`?fileID=${file.fileId}`}
        key={file.fileId}
        className=" h-full "
        >
          <Document   
            className=" w-full  flex justify-center border border-slate-200 items-center object-contain"
            file={file.data}
            // onLoadSuccess={({ numPages }) => setPageCount(numPages)}
            onLoadError={console.error}
          >
            <Page
              
              className="[&>canvas]:!h-52 [&>canvas]:!w-full "
              pageNumber={1}
              // renderMode="svg"
              // width={300}
              renderAnnotationLayer={false}
              renderTextLayer={false}
            />
          </Document>
          <div className=" border border-t-0 border-slate-200">
          <p key={file.fileId} className="max-w-[150px] w-fit py-2 ml-auto mr-auto overflow-hidden text-sm text-ellipsis whitespace-nowrap text-slate-400">
            {file.fileName}
          </p>
          </div>
        </Link>
      ))}
      </div>
    </section>
  );
}

export default RecentUploads;
