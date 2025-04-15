import { useEffect, useState, Dispatch, SetStateAction } from "react";

const useDebounce = (initialValue: string,delay: number): [string, Dispatch<SetStateAction<string>>] => {
  const [actualValue, setActualValue] = useState<string>(initialValue);
  const [debounceValue, setDebounceValue] = useState<string>(initialValue);

  useEffect(() => {
    const debounceId = setTimeout(() => setDebounceValue(actualValue), delay);
    return () => clearTimeout(debounceId);
  }, [actualValue, delay]);

  return [debounceValue, setActualValue];
};

export default useDebounce;
