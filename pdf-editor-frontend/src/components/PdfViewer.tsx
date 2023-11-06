import { Check, ChevronDown, File, GripVertical, XIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Document, Page } from "react-pdf";
import { useLocation } from "react-router-dom";
import { API_URL } from "@/lib/constant";
import { file } from "@/types/files";


function PdfViewer({ files }: { files: file[] }) {
  const { search } = useLocation();
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<number[]>([]);
  const [order, setOrder] = useState<number[]>([]);
//   const [loading, setLoading] = useState(false);
  const [downloadFile, setDownloadFile] = useState<string | null>(null);

  const queryParams = new URLSearchParams(search);


  const fileId = queryParams.get("fileID");
  // debugger;

  useEffect(() => {
    setOrder(Array.from({ length: pageCount }).map((_, i) => i));
  },[pageCount])
  const file = useMemo(() => {
    const file = files?.find((file: file) => file.fileId === fileId);
    if (files) {
      return file;
    } else {
      return null;
    }
  }, []);

  useEffect(() => {
    setSelected(Array.from({ length: pageCount }).map((_, i) => i));
  }, [pageCount]);

  const handleSelect = (page: number) => {
    if (selected.includes(page)) {
      setSelected(selected.filter((p) => p !== page));
    } else {
      const newSelected = [...selected, page];

      setSelected(newSelected.sort());
    }
  };

  return (
    <div className="absolute w-full h-full z-10 top-0 left-0 backdrop-blur-md bg-black/50">
      <div className="h-[10%] w-full" />
      <div className="mt-auto left-0 h-[90%] overflow-y-auto bg-white rounded-t-xl relative">
        <div className="fixed z-20 w-full bg-white rounded-t-md">
        <Button variant="ghost" asChild className="w-full ">
          <Link to="/">
            <ChevronDown size="32px" />
          </Link>
        </Button>
        <Button
                onClick={async () => {
                    const pages: number[] = []
                    order.forEach((id) => {
                        if(selected.includes(id)){
                            pages.push(id)
                        }
                    })
                  const res = await fetch(API_URL + "/split", {
                    method: "POST",
                    body: JSON.stringify({
                      fileId: fileId,
                      pages: pages,
                    }),
                    headers: {
                      "Content-Type": "application/json",
                    },
                  });
                  const data = await res.json();
                  console.log(data);
                  setDownloadFile(data.fileId);
                }}
                className="flex justify-center items-center gap-3 absolute top-0 right-5"
              >
                Split
                <File size="24px" strokeWidth={1} />
              </Button>
              </div>
        <div className="pt-12">
          <div className="w-full ">
            <DragDropContext onDragEnd={(result) => {
                console.log(result)
                if (!result.destination) return;
                const items = Array.from(order);
                console.log(items)
                const [reorderedItem] = items.splice(result.source.index, 1);
                items.splice(result.destination.index, 0, reorderedItem);
                console.log(items)
                setOrder(items);
            }}>
              <Document
                className=" w-full  flex justify-center border border-slate-200 items-center object-contain"
                file={file?.data}
                onLoadSuccess={({ numPages, ...value }) => {
                  console.log(value);
                  setPageCount(numPages);
                }}
                onLoadError={console.error}
              >
                <Droppable droppableId="droppable" direction="horizontal" >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className=" p-2 grid content-center place-content-center w-full h-full grid-cols-1 md:grid-cols-4 gap-3 "
                    >
                      {order.map((id, i) => (
                        <Draggable key={id} draggableId={id.toString()} index={i}>
                          {(provided) => (
                            <div
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className={`p-2 bg-white border cursor-pointer relative ${
                                selected.includes(id)
                                  ? "border-2 border-green-500"
                                  : ""
                              }`}
                              onClick={() => handleSelect(id)}
                            >
                              <Page
                                className={` drop-shadow-md realtive border hover:shadow-xl [&>canvas]:!h-auto [&>canvas]:!w-full `}
                                pageNumber={id + 1}
                                renderAnnotationLayer={false}
                                renderTextLayer={false}
                                //   width={200}
                              />
                              <div {...provided.dragHandleProps} className="absolute bottom-0 right-0">
                                <GripVertical size="24px" />
                              </div>
                              <p className="mt-2 text-center">{i + 1}</p>
                              {selected.includes(id) && (
                                <div className="p-[2px] bg-white rounded-full absolute -top-2 -right-2 drop-shadow-md">
                                  <Check
                                    size="24px"
                                    className="text-green-500 "
                                  />{" "}
                                </div>
                              )}
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Document>
            </DragDropContext>
            
          </div>
          {downloadFile && <SplitedDownload downloadFile={downloadFile} />}
        </div>
      </div>
    </div>
  );
}

export default PdfViewer;

function SplitedDownload({ downloadFile }: {downloadFile: string}) {
  return (
    <div className="absolute z-30 top-0 left-0 w-full h-full backdrop-blur-sm flex justify-center items-center">
      <Button
        onClick={async () => {
          const res = await fetch(`${API_URL}/download/${downloadFile}`);
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = "splited.pdf";
          a.click();
        }}
        className="w-60 bg-green-500 h-14 hover:bg-green-500/70 text-white"
      >
        Download File
      </Button>
      <Link className="bg-white rounded-full p-2 drop-shadow " to="/">
        <XIcon />
      </Link>
    </div>
  );
}
