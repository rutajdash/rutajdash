"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSpeechContext } from "../speech/SpeechContext";
import { AgentContext, EmittedEvents, ReceivedEvents } from "./AgentContext";

export default function AgentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [agentSocket, setAgentsocket] =
    useState<Socket<ReceivedEvents, EmittedEvents>>();
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  const { updateSpeechEntry, completeSpeechEntry } = useSpeechContext();

  useEffect(() => {
    const socket: Socket<ReceivedEvents, EmittedEvents> = io("localhost:8000", {
      path: "/io",
      transports: ["websocket"],
    });

    setAgentsocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!agentSocket) {
      return;
    }

    agentSocket.on("connect", () => {
      console.info(`Agent Socket | Connected | Socket ID: ${agentSocket.id}`);
      setIsSocketConnected(true);
    });

    agentSocket.on("connect_error", (error: Error) => {
      console.error("Agent Socket | Connection Error:", error);
      setIsSocketConnected(false);
    });

    agentSocket.on("disconnect", (reason: Socket.DisconnectReason) => {
      console.warn(`Agent Socket | Disconnected | Reason: ${reason}`);
      setIsSocketConnected(false);
    });

    agentSocket.on("agentTextChunk", (textChunk: string) => {
      updateSpeechEntry(textChunk);
    });

    agentSocket.on("agentAudioChunk", (audioChunk: string) => {
      console.log("Agent Audio Chunk:", audioChunk);
    });

    agentSocket.on("agentResponseEnd", (message: string) => {
      completeSpeechEntry(message);
    });

    return () => {
      setIsSocketConnected(false);
      agentSocket.off("connect");
      agentSocket.off("connect_error");
      agentSocket.off("disconnect");
      agentSocket.off("agentTextChunk");
      agentSocket.off("agentAudioChunk");
      agentSocket.off("agentResponseEnd");
      agentSocket.disconnect();
    };
  }, [agentSocket, completeSpeechEntry, updateSpeechEntry]);

  return (
    <AgentContext.Provider
      value={{
        agentSocket,
        isSocketConnected,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
