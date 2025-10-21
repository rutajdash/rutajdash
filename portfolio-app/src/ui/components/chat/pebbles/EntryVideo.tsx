"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";
import { RefObject, useEffect, useState } from "react";
import styles from "./Video.module.css";

export default function PebblesEntryVideo({
  videoRef,
  onEnded,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  onEnded: () => void;
}) {
  const { setIsVideoReady, completeSpeechEntry } = useSpeechContext();

  const [isPlaying, setIsPlaying] = useState(false);

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
        setIsPlaying(true);
        completeSpeechEntry("Hey, I'm Pebbles!");
      }}
      onEnded={() => onEnded()}
      className={`${styles.motion} ${isPlaying ? styles.play : ""}`}
      preload="auto"
    />
  );
}
