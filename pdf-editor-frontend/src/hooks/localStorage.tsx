import { useEffect, useState } from "react";
import { localFile } from "@/types/files";

function useLocalStorage(key: string, defaultValue: unknown) {
    // Retrieve data from localStorage when the component mounts
    const [data, setData] = useState<localFile[]>(() => {
      const storedData = localStorage.getItem(key);
      return storedData ? JSON.parse(storedData) : defaultValue;
    });
  
    // Update localStorage whenever the data changes
    useEffect(() => {
      if (data === null) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(data));
      }
    }, [data, key]);
  
    return [data, setData] as const;
  }
  
  export default useLocalStorage;
  