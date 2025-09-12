import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import api from "@/src/api";

interface DataContextData {
  data: any | null;
  isLoading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

const DataContext = createContext<DataContextData>({} as DataContextData);

interface DataProviderProps {
  children: ReactNode;
}

export function DataProvider({ children }: DataProviderProps) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.get("/meu-endpoint");
      setData(response.data);
    } catch (err: any) {
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DataContext.Provider value={{ data, isLoading, error, reload: fetchData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
