"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AudioContext } from "./AudioContext";

export default function AudioProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const audioCtxRef = useRef<AudioContext | undefined>(undefined);
  const [audioQueue, setAudioQueue] = useState<AudioBuffer[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);

  if (typeof window !== "undefined" && !audioCtxRef.current) {
    audioCtxRef.current = new window.AudioContext();
  }

  useEffect(() => {
    if (!audioCtxRef.current) {
      return;
    }
    if (isPlaying) {
      return;
    }
    if (audioQueue.length === 0) {
      return;
    }

    console.log("Playing next");
    setIsPlaying(true);
    const nextBuffer = audioQueue[0];
    const source = audioCtxRef.current.createBufferSource();
    source.buffer = nextBuffer;
    source.connect(audioCtxRef.current.destination);
    source.start(0);

    source.onended = () => {
      setAudioQueue((prevQueue) => prevQueue.slice(1));
      setIsPlaying(false);
    };
  }, [audioQueue, isPlaying]);

  const addAudioChunkToQueue = useCallback(async (base64PCM16: string) => {
    if (!audioCtxRef.current) {
      console.error("AudioContext is not initialized.");
      return;
    }

    // Decode base64 PCM16 to AudioBuffer and add to queue
    const uint8array = Uint8Array.from(Buffer.from(base64PCM16, "base64"));

    const audioBuffer = await audioCtxRef.current.decodeAudioData(
      uint8array.buffer,
    );

    setAudioQueue((prevQueue) => [...prevQueue, audioBuffer]);
  }, []);

  return (
    <AudioContext.Provider
      value={{
        addAudioChunkToQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}
