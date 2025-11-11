import { Fragment, RefObject, useMemo } from "react";
import useTypewriter from "./useTypewriter";

export default function Typewriter({
  text,
  scrollRef,
}: {
  text: string;
  scrollRef?: RefObject<HTMLDivElement | null>;
}) {
  const displayText = useTypewriter(text, scrollRef);

  const randomSuffix = useMemo(
    () => Math.random().toString(36).substring(2, 8),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [displayText],
  );

  return (
    <p
      key={`typewriter-${randomSuffix}`}
      className="text-on-surface-variant text-sm"
    >
      {displayText.split("\n").map((line, index) =>
        index === 0 ? (
          <span key={`typewriter-text-${index}-${randomSuffix}`}>{line}</span>
        ) : (
          <Fragment key={`typewriter-fragment-${index}-${randomSuffix}`}>
            <br key={`typewriter-break-${index}-${randomSuffix}`} />
            <span key={`typewriter-text-${index}-${randomSuffix}`}>{line}</span>
          </Fragment>
        ),
      )}
    </p>
  );
}
