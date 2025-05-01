import { useEffect, useState } from "react";

export const useDebounse = (value: string) => {
  const [approve, setApprove] = useState<boolean>(false);
  const TTL = 500;
  useEffect(() => {
    setApprove(false);
    const timeout = setTimeout(() => {
      setApprove(true);
    }, TTL);
    return () => clearTimeout(timeout);
  }, [value]);

  return { approve };
};
