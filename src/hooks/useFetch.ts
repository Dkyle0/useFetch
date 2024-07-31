import { useEffect, useState } from "react";

interface UseFetchReturnType<T> {
  data: T[];
  isLoading: boolean;
  error: Error | undefined;
  refetch: (options?: RefetchOptions) => void;
}

interface RefetchOptions {
  params?: { [key: string]: any };
}

export const useFetch = <T>(url: string): UseFetchReturnType<T> => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [fetchUrl, setFetchUrl] = useState(url);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(fetchUrl);
        const fetchedData = await response.json();
        setData(fetchedData);
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e);
        } else {
          setError(new Error("Error"));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [fetchUrl]);

  const refetch = (options?: RefetchOptions) => {
    if (options?.params) {
      const queryParams = new URLSearchParams(options.params).toString();
      setFetchUrl(`${url}?${queryParams}`);
    } else {
      setFetchUrl(url);
    }
  };

  return { data, isLoading, error, refetch };
};
