import { RefObject, useEffect, useRef, useState } from "react";

export default function useTypewriter(
  text: string,
  scrollRef?: RefObject<HTMLDivElement | null>,
) {
  const lastDisplayText = useRef("");
  const matchCount = useRef(0);
  const [displayText, setDisplayText] = useState("");
  const [displayLength, setDisplayLength] = useState(0);
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    while (
      matchCount.current < text.length &&
      matchCount.current < lastDisplayText.current.length &&
      text[matchCount.current] === lastDisplayText.current[matchCount.current]
    ) {
      matchCount.current++;
    }

    const typingInterval = setInterval(() => {
      setDisplayLength((prev) => {
        if (scrollRef?.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (prev > matchCount.current) {
          return prev - 1;
        } else {
          clearInterval(typingInterval);
          setDisplayText(text);
          return prev;
        }
      });
    }, 10);

    return () => {
      lastDisplayText.current = text;
      matchCount.current = 0;
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [scrollRef, text]);

  useEffect(() => {
    const typingInterval = setInterval(() => {
      setDisplayLength((prev) => {
        if (scrollRef?.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
        if (prev < displayText.length) {
          return prev + 1;
        } else {
          clearInterval(typingInterval);
          return prev;
        }
      });
    }, 50);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      if (typingInterval) clearInterval(typingInterval);
      if (cursorInterval) clearInterval(cursorInterval);
    };
  }, [displayText, scrollRef]);

  return (
    text.substring(0, displayLength + 1) +
    (showCursor || displayLength < text.length ? " ●" : "")
  );
}
