"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";
import { RefObject, useEffect } from "react";

export default function PebblesIntroVideo({
  videoRef,
  onEnded,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  onEnded: (currentVideoId: number) => void;
}) {
  const { setIsVideoReady, completeSpeechEntry } = useSpeechContext();

  useEffect(() => {
    setIsVideoReady(true);

    return () => {
      setIsVideoReady(false);
    };
  }, [setIsVideoReady]);

  return (
    <video
      ref={videoRef}
      onPlay={() => {
        completeSpeechEntry(
          "As Mr.Dash's personal assistant, I have access to his resume, portfolio and projects. I can help you with things like telling you more about him, if you want, or about his projects, how they're going and the latest updates. I may be a penguin, but I promise I'm smart. So, what can I help you with today?",
        );
      }}
      onEnded={() => onEnded(1)}
      preload="auto"
    />
  );
}
