"use client";

import pebblesData from "@/assets/pebbles.json";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAppStoreContext } from "../app/AppStoreContext";
import processAudio from "./processAudio";
import { SpeechContext } from "./SpeechContext";

export default function SpeechProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [audioContext, setAudioContext] = useState<AudioContext>();

  useEffect(() => {
    const windowAudioContext = window.AudioContext;
    if (!windowAudioContext) {
      throw new Error("Web Audio API is not supported in this browser.");
    }
    setAudioContext(new AudioContext());
  }, []);

  const [speechText, setSpeechText] = useState<string[]>([]);
  const [speechAudio, setSpeechAudio] = useState<AudioBuffer[]>([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [currentAudio, setCurrentAudio] = useState<number>(0);

  useEffect(() => {
    if (!audioContext || isAudioPlaying) {
      return;
    }
    if (speechAudio.length === 0 || currentAudio > speechAudio.length) {
      return;
    }
    if (currentAudio === 0) {
      setCurrentAudio(1);
      return;
    }

    const source = audioContext.createBufferSource();
    source.buffer = speechAudio[currentAudio - 1];
    source.connect(audioContext.destination);

    source.onended = () => {
      setCurrentAudio((prev) => prev + 1);
      setIsAudioPlaying(false);
    };

    setIsAudioPlaying(true);
    source.start();
  }, [audioContext, speechAudio, isAudioPlaying, currentAudio]);

  const addSpeechText = useMemo(() => {
    return (text: string) => {
      setSpeechText((prev) => [...prev, text]);
    };
  }, []);
  const addSpeechAudio = useMemo(() => {
    return (audio: string) => {
      if (!audioContext) {
        return;
      }
      const audioBuffer = processAudio(audioContext, audio);
      setSpeechAudio((prev) => [...prev, audioBuffer]);
    };
  }, [audioContext]);
  const clearSpeech = useMemo(() => {
    return () => {
      setSpeechText([]);
      setSpeechAudio([]);
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
        speechText,
        addSpeechText,
        speechAudio,
        addSpeechAudio,
        clearSpeech,
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
