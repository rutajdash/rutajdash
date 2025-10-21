"use client";

import { useAgentContext } from "@/data/store/agent/AgentContext";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export default function ChatBottomBar() {
  const {
    textOnly,
    setTextOnly,
    status,
    isSpeaking,
    sendUserMessage,
    transcription,
  } = useAgentContext();
  const [message, setMessage] = useState("");

  useEffect(() => {
    setMessage(transcription);
  }, [transcription]);

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
            disabled={status !== "connected"}
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
          className={`bg-primary-container flex h-14 flex-row items-center justify-between overflow-clip rounded-full px-1 transition-all duration-200 ease-in-out ${message.trim().length > 0 ? "w-14" : "w-28"}`}
        >
          <div
            key="send-icon-div"
            className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
            onClick={() => {
              if (message.trim().length === 0) {
                return;
              }
              if (status !== "connected") {
                return;
              }
              sendUserMessage(message.trim());
              setMessage("");
            }}
          >
            <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
              send
            </span>
          </div>
          {message.trim().length <= 0 && (
            <div
              key="mic-icon-div"
              className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out"
              onClick={() => {
                if (status !== "connected" || isSpeaking) {
                  return;
                }
                setTextOnly((prev) => !prev);
              }}
            >
              <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
                {!textOnly ? "close" : "mic"}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
