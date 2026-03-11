import { useState, useEffect } from "react";

const useScrollPosition = () => {
  const [scrollY,         setScrollY]         = useState(0);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [isAtTop,         setIsAtTop]         = useState(true);

  useEffect(() => {
    let lastY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrollY(currentY);
      setIsAtTop(currentY < 10);
      setScrollDirection(currentY > lastY ? "down" : "up");
      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return { scrollY, scrollDirection, isAtTop };
};

export default useScrollPosition;