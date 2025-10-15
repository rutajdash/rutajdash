"use client";

import pebblesData from "@/assets/pebbles.json";
import { useAppStoreContext } from "@/data/store/app/AppStoreContext";
import VideoDB from "@/data/store/app/VideoDB";
import { AnimatePresence } from "motion/react";
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Loading from "./Loading";
import LoadingReady from "./LoadingReady";

export default function LoadingLayout({
  children,
  videoRef,
}: {
  children: React.ReactNode;
  videoRef: RefObject<HTMLVideoElement | null>;
}) {
  const { videoDB, setVideoBlobs } = useAppStoreContext();
  const [loadingPercentage, setLoadingPercentage] = useState(0);

  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!videoDB) {
      return;
    }

    const timer = new Promise((resolve) => setTimeout(resolve, 2000));
    const videos = loadVideos(videoDB, setLoadingPercentage);

    Promise.all([timer, videos]).then(([, videos]) => {
      setVideoBlobs(videos);
      setIsLoading(false);
    });
  }, [videoDB, setVideoBlobs]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isActive && videoRef.current) {
        videoRef.current.play();
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [isActive, videoRef]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && !isActive && (
        <Loading loadingPercentage={loadingPercentage} />
      )}
      {!isLoading && !isActive && <LoadingReady setIsActive={setIsActive} />}
      {!isLoading && isActive && children}
    </AnimatePresence>
  );
}

async function loadVideos(
  db: VideoDB,
  setLoadingPercentage: Dispatch<SetStateAction<number>>,
): Promise<Map<string, Blob>> {
  const videos: Map<string, Blob> = new Map();

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const futures = pebblesData.videos.map((video) =>
    fetchVideo(video.url, db).then((blob) => {
      videos.set(video.url, blob);
      setLoadingPercentage((prev) => prev + 100 / pebblesData.videos.length);
    }),
  );
  await Promise.all(futures);

  return videos;
}

async function fetchVideo(url: string, db: VideoDB): Promise<Blob> {
  const key = await db.preloadVideo(url);
  const blob = await db.getVideo(key);
  return blob;
}
