import { API_URL } from "@/lib/constant"
import { file } from "@/types/files"
import { useEffect, useState } from "react"

type pdf = {
    fileId: string
}

export function useGetAllPdf(pdf: pdf[] = []) {
    const [files, setFiles] = useState<file[] | null>(null)

    function getAllPdf() {
        console.log("getting pdf", pdf)
        fetch(API_URL+"/pdf/getall",{
            mode: "cors",
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(pdf),
        }).then(res => res.json()).then(data => {
            console.log("getting data", data)
          setFiles(data.response)
        })
    }
    useEffect(() => {
        getAllPdf()
    },[pdf])

    return { files, getAllPdf  }
}