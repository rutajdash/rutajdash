import { createContext, useContext } from "react";

export interface AudioContextType {
  addAudioChunkToQueue: (base64PCM16: string) => void;
}

export const AudioContext = createContext<AudioContextType | undefined>(
  undefined,
);

export function useAudioContext(): AudioContextType {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}
