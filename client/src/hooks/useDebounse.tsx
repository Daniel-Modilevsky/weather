import { useEffect, useState } from "react";

export const useDebounse = (value: string) => {
  /**
   *  Debouncing: Debouncing involves starting a timer when an event occurs,
   *  and resetting the timer whenever a new event occurs within the delay period
   */
  const [approve, setApprove] = useState<boolean>(false);
  const TTL = 500;
  useEffect(() => {
    setApprove(false);
    const timeout = setTimeout(() => {
      console.log("Time is up");
      setApprove(true);
    }, TTL);
    return () => clearTimeout(timeout);
  }, [value]);

  return { approve };
};
