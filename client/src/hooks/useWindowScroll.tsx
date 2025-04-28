import { useEffect, useState } from "react";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

export function useWindowScroll() {
  const [windowLocation, setWindowLocation] = useState<{
    width: number;
    height: number;
  }>(getWindowDimensions());

  const scrollCurrentY = window.scrollY;
  const windowHeight = window.innerHeight;
  const fullHeight = document.documentElement.scrollHeight;

  useEffect(() => {
    function handleResize() {
      setWindowLocation(getWindowDimensions());
    }

    window.addEventListener("scroll", handleResize);
    return () => window.removeEventListener("scroll", handleResize);
  }, []);

  return { scrollCurrentY, windowHeight, fullHeight };
}
