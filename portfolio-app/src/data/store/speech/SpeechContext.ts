import {
  createContext,
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
} from "react";

interface SpeechContextProps {
  speechText: string[];
  addSpeechText: (text: string) => void;

  speechAudio: AudioBuffer[];
  addSpeechAudio: (audio: string) => void;

  clearSpeech: () => void;

  currentVideo: number;
  setCurrentVideo: Dispatch<SetStateAction<number>>;

  videoRef: RefObject<HTMLVideoElement | null>;
  setIsVideoReady: Dispatch<SetStateAction<boolean>>;
}

export const SpeechContext = createContext<SpeechContextProps | undefined>(
  undefined,
);

export const useSpeechContext = () => {
  const context = useContext(SpeechContext);
  if (!context) {
    throw new Error("useSpeechContext must be used within a SpeechProvider");
  }
  return context;
};
