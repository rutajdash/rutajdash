import { createContext, useContext } from "react";
import { Socket } from "socket.io-client";

export type EmittedEvents = {
  userMessage: (message: string) => void;
};

export type ReceivedEvents = {
  agentTextChunk: (textChunk: string) => void;
  agentAudioChunk: (audioChunk: string) => void;
  agentResponseEnd: (message: string) => void;
};

interface AgentContextProps {
  agentSocket?: Socket<ReceivedEvents, EmittedEvents>;
  isSocketConnected: boolean;
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
