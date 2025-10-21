import { createContext, Dispatch, SetStateAction, useContext } from "react";
import { Status } from "@elevenlabs/react";

interface AgentContextProps {
  textOnly: boolean;
  setTextOnly: Dispatch<SetStateAction<boolean>>;
  micMuted: boolean;
  setMicMuted: Dispatch<SetStateAction<boolean>>;
  volume: number;
  setVolume: Dispatch<SetStateAction<number>>;

  status: Status;
  isSpeaking: boolean;
  sendUserMessage: (text: string) => void;
  sendUserActivity: () => void;

  transcription: string;
}

export const AgentContext = createContext<AgentContextProps | undefined>(
  undefined,
);

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentContext must be used within a AgentProvider");
  }
  return context;
};
