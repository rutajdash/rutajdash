"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";
import { Typewriter } from "@/ui/components/widgets";
import { useMemo, useRef } from "react";

export default function VideoCaptions() {
  const { speechHistory, latestSpeechEntry } = useSpeechContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  const speechText = useMemo(
    () =>
      [...speechHistory, latestSpeechEntry].filter(
        (entry) => entry.trim() !== "",
      ),
    [latestSpeechEntry, speechHistory],
  );

  return (
    <div className="px-4 pt-3">
      <div
        ref={scrollRef}
        className="bg-surface-container-high max-h-40 min-h-20 overflow-scroll rounded-2xl px-2 py-2"
      >
        <Typewriter text={speechText.join("\n")} scrollRef={scrollRef} />
      </div>
    </div>
  );
}
