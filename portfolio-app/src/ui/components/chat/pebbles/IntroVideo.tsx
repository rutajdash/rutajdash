"use client";

import pebblesData from "@/assets/pebbles.json";
import { useAppStoreContext } from "@/data/store/app/AppStoreContext";
import { RefObject, useEffect, useMemo } from "react";

export default function PebblesIntroVideo({
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

    const videoUrl = pebblesData.videos.find((item) => item.id === 2)?.url;
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

  return (
    <video
      ref={videoRef}
      src={videoURL ?? undefined}
      onEnded={() => onEnded(1)}
      preload="auto"
    />
  );
}
