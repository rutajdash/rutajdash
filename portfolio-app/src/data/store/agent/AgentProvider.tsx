"use client";

import { useConversation } from "@elevenlabs/react";
import { useEffect, useState } from "react";
import { useSpeechContext } from "../speech/SpeechContext";
import { AgentContext } from "./AgentContext";

export default function AgentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { startSpeechEntry, updateSpeechEntry, completeSpeechEntry } =
    useSpeechContext();

  const [textOnly, setTextOnly] = useState<boolean>(true);
  const [micMuted, setMicMuted] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(0.8);

  const [transcription, setTranscription] = useState<string>("");

  const {
    startSession,
    endSession,
    status,
    isSpeaking,
    sendUserMessage,
    sendUserActivity,
  } = useConversation({
    agentId: "agent_7401k7mtzpz7f3ts2vq4f7xtge3y",
    serverLocation: "in-residency",
    micMuted,
    volume,
    textOnly,
    useWakeLock: true,
    preferHeadphonesForIosDevices: true,
    // clientTools: {}, // Record<string, (parameters: any) => Promise<string | number | void> | string | number | void>
  });

  useEffect(() => {
    startSession({
      agentId: "agent_7401k7mtzpz7f3ts2vq4f7xtge3y",
      connectionType: "websocket",

      onConnect(props) {
        console.info(
          `Pebbles | Connected | Conversation ID: ${props.conversationId}`,
        );
      },
      onDisconnect(details) {
        console.info(`Pebbles | Disconnected | Reason: ${details.reason}`);
      },
      onError(message, context) {
        console.error(`Pebbles | Error | Message: ${message} | `, context);
      },
      onStatusChange(prop) {
        console.info(`Pebbles | Status Change | New Status: ${prop.status}`);
      },
      onDebug(props) {
        console.debug("Pebbles | Debug Info: ", props);
      },

      onMessage(props) {
        if (props.source === "ai") {
          completeSpeechEntry(props.message);
        } else if (props.source === "user") {
          setTranscription(props.message);
        }
      },
      onAgentChatResponsePart(props) {
        if (props.type === "start") {
          startSpeechEntry(props.text);
        } else if (props.type === "delta") {
          updateSpeechEntry(props.text);
        } else if (props.type === "stop") {
          updateSpeechEntry(props.text);
        }
      },

      // onAgentToolResponse(props) {},

      onInterruption(props) {
        console.info(`Pebbles | Interrupted Event: ${props.event_id}`);
      },

      // onMCPConnectionStatus(props) {},
      // onMCPToolCall(props) {},

      onUnhandledClientToolCall(params) {
        console.warn(
          `Pebbles | Unhandled Client Tool Call | Event ID: ${params.event_id} | Tool Name: ${params.tool_name} | Call ID: ${params.tool_call_id} | Parameters: `,
          params.parameters,
        );
      },
      onVadScore(props) {
        console.info(`Pebbles | VAD Score | Score: ${props.vadScore}`);
      },
    });
    return () => {
      endSession();
    };
  }, [
    completeSpeechEntry,
    endSession,
    startSession,
    startSpeechEntry,
    updateSpeechEntry,
  ]);

  return (
    <AgentContext.Provider
      value={{
        textOnly,
        setTextOnly,
        micMuted,
        setMicMuted,
        volume,
        setVolume,
        status,
        isSpeaking,
        sendUserMessage,
        sendUserActivity,
        transcription,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
