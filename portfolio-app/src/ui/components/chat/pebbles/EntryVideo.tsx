"use client";

import pebblesData from "@/assets/pebbles.json";
import { useAppStoreContext } from "@/data/store/app/AppStoreContext";
import { RefObject, useEffect, useMemo, useState } from "react";
import styles from "./Video.module.css";

export default function PebblesEntryVideo({
  videoRef,
  onEnded,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  onEnded: (currentVideoId: number) => void;
}) {
  const { videoBlobs } = useAppStoreContext();

  const videoURL = useMemo(() => {
    if (!videoBlobs) {
      return null;
    }

    const videoUrl = pebblesData.videos.find((item) => item.id === 1)?.url;
    if (!videoUrl) {
      return null;
    }

    const blob = videoBlobs.get(videoUrl);
    if (!blob) {
      return null;
    }

    return URL.createObjectURL(blob);
  }, [videoBlobs]);

  useEffect(() => {
    // return () => {
    //   if (videoURL) {
    //     URL.revokeObjectURL(videoURL);
    //   }
    // };
  }, [videoURL]);

  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <video
      ref={videoRef}
      src={videoURL ?? undefined}
      onPlay={() => setIsPlaying(true)}
      onEnded={() => onEnded(1)}
      className={`${styles.motion} ${isPlaying ? styles.play : ""}`}
      preload="auto"
    />
  );
}
