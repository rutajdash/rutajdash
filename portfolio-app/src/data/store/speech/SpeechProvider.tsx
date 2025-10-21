"use client";

import pebblesData from "@/assets/pebbles.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStoreContext } from "../app/AppStoreContext";
import { SpeechContext } from "./SpeechContext";

export default function SpeechProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [speechHistory, setSpeechHistory] = useState<string[]>([]);
  const [latestSpeechEntry, setLatestSpeechEntry] = useState<string>("");

  const startSpeechEntry = useMemo(() => {
    return (text: string) => {
      setLatestSpeechEntry(text);
    };
  }, []);
  const updateSpeechEntry = useMemo(() => {
    return (text: string) => {
      setLatestSpeechEntry((prev) => prev + text);
    };
  }, []);
  const completeSpeechEntry = useMemo(() => {
    return (text: string) => {
      setLatestSpeechEntry("");
      setSpeechHistory((prev) => [...prev, text]);
    };
  }, []);
  const clearSpeechHistory = useMemo(() => {
    return () => {
      setSpeechHistory([]);
    };
  }, []);

  const appStoreContext = useAppStoreContext();
  const [currentVideo, setCurrentVideo] = useState<number>(1);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoReady, setIsVideoReady] = useState<boolean>(false);

  // TODO: alert user about errors
  useEffect(() => {
    const loadAndPlayVideo = async () => {
      if (appStoreContext.videoDB === undefined) {
        return;
      }
      if (!videoRef.current || !isVideoReady) {
        return;
      }

      const videoUrl = pebblesData.videos.find(
        (item) => item.id === currentVideo,
      )?.url;
      if (!videoUrl) {
        console.error(`Video with id ${currentVideo} not found.`);
        return;
      }

      const videoBlob = await appStoreContext.videoDB.getVideo(videoUrl);
      if (!videoBlob) {
        console.error(`Video blob for url ${videoUrl} not found.`);
        return;
      }

      const objectUrl = URL.createObjectURL(videoBlob);
      videoRef.current.src = objectUrl;

      videoRef.current.load();
      videoRef.current.play().catch((error) => {
        console.error("Error playing video:", error);
      });

      return objectUrl;
    };

    const objectUrlPromise = loadAndPlayVideo();

    return () => {
      objectUrlPromise.then((objectUrl) => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
        }
      });
    };
  }, [appStoreContext.videoDB, currentVideo, isVideoReady, videoRef]);

  return (
    <SpeechContext.Provider
      value={{
        speechHistory,
        clearSpeechHistory,
        latestSpeechEntry,
        startSpeechEntry,
        updateSpeechEntry,
        completeSpeechEntry,
        currentVideo,
        setCurrentVideo,
        videoRef,
        setIsVideoReady,
      }}
    >
      {children}
    </SpeechContext.Provider>
  );
}
