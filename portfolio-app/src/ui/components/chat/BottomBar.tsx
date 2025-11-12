"use client";

import { useAgentContext } from "@/data/store/agent/AgentContext";
import { AudioFormat, CommitStrategy, useScribe } from "@elevenlabs/react";
import { motion } from "motion/react";
import { useState } from "react";

export default function ChatBottomBar() {
  const [message, setMessage] = useState("");
  const { agentSocket, isSocketConnected } = useAgentContext();

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    onPartialTranscript: (data) => {
      setMessage((prev) => prev + data.text);
    },
    onCommittedTranscript: (data) => {
      setMessage(data.text);
      scribe.disconnect();
    },
    onAuthError(data) {
      console.error("Scribe Auth Error:", data);
      scribe.disconnect();
    },
    onError(error) {
      console.error("Scribe Error:", error);
      scribe.disconnect();
    },
  });

  return (
    <>
      <div key="chat-bottom-buffer" className="h-24 w-full" />
      <motion.div
        key="chat-bottom-bar"
        className="absolute bottom-0 flex w-full flex-row justify-center gap-2 px-2 py-4"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        exit={{ y: 100 }}
        transition={{
          delay: 0.5,
          mass: 1,
          stiffness: 150,
          damping: 10,
          type: "spring",
        }}
      >
        <div className="bg-surface-container-high flex max-h-32 min-h-14 w-full flex-row items-center justify-evenly overflow-clip rounded-2xl">
          <textarea
            placeholder="Type a message..."
            name="message"
            className="placeholder:text-on-surface-variant field-sizing-content h-auto w-full flex-1 resize-none rounded-2xl bg-transparent px-3 py-2.5 text-base outline-none"
            rows={1}
            value={message}
            disabled={!agentSocket || !isSocketConnected}
            onFocus={(event) => {
              setTimeout(() => {
                event.target.scrollIntoView({
                  behavior: "smooth",
                });
              }, 100);
            }}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
          />
        </div>
        <div
          className={`bg-primary-container flex h-14 flex-row items-center justify-between overflow-clip rounded-full px-1 transition-all duration-200 ease-in-out ${message.trim().length > 0 && !scribe.isConnected ? "w-14" : "w-28"}`}
        >
          <div
            key="send-icon-div"
            className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
            onClick={() => {
              if (message.trim().length === 0) {
                return;
              }
              if (!agentSocket || !isSocketConnected) {
                return;
              }
              agentSocket.emit("userMessage", message.trim());
              setMessage("");
            }}
          >
            <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
              send
            </span>
          </div>
          {(message.trim().length <= 0 || scribe.isConnected) && (
            <div
              key="mic-icon-div"
              className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
              onClick={async () => {
                if (
                  scribe.status === "connecting" ||
                  scribe.status === "transcribing"
                ) {
                  return;
                }

                if (
                  scribe.status === "connected" ||
                  scribe.status === "error"
                ) {
                  scribe.disconnect();
                  return;
                }

                const { token } = await fetch("/api/scribe-access-token", {
                  method: "POST",
                  mode: "same-origin",
                })
                  .then((res) => res.json())
                  .catch((err) => {
                    console.error("Error fetching scribe access token:", err);
                    return { token: null };
                  });

                if (!token) {
                  console.error("No scribe access token received");
                  return;
                }

                await scribe.connect({
                  token,
                  microphone: {
                    echoCancellation: true,
                    noiseSuppression: true,
                  },
                  languageCode: "en",
                  audioFormat: AudioFormat.PCM_16000,
                  commitStrategy: CommitStrategy.VAD,
                });
              }}
            >
              <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
                {scribe.status === "connecting" && "progress_activity"}
                {scribe.status === "connected" && "close"}
                {scribe.status === "disconnected" && "mic"}
                {scribe.status === "transcribing" && "more_horiz"}
                {scribe.status === "error" && "error"}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
