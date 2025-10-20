import { RefObject } from "react";
import useTypewriter from "./useTypewriter";

export default function Typewriter({
  text,
  scrollRef,
}: {
  text: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const displayText = useTypewriter(text, scrollRef);

  return (
    <>
      {displayText.split("\n").map((line, index) =>
        index === 0 ? (
          <span key={`typewriter-text-${index}-${line}`}>{line}</span>
        ) : (
          <>
            <br key={`typewriter-break-${index}-${line}`} />
            <span key={`typewriter-text-${index}-${line}`}>{line}</span>
          </>
        ),
      )}
    </>
  );
}
