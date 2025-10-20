"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";
import { Typewriter } from "@/ui/components/widgets";
import { useRef } from "react";

export default function VideoCaptions() {
  const { speechText } = useSpeechContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="px-4 pt-3">
      <div
        ref={scrollRef}
        className="bg-surface-container-high max-h-40 min-h-20 overflow-scroll rounded-2xl px-2 py-2"
      >
        <p className="text-on-surface-variant text-sm">
          <Typewriter text={speechText.join("\n")} scrollRef={scrollRef} />
        </p>
      </div>
    </div>
  );
}
