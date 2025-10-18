"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";
import PebblesEntryVideo from "@/ui/components/chat/pebbles/EntryVideo";
import PebblesIntroVideo from "@/ui/components/chat/pebbles/IntroVideo";
import VideoCaptions from "@/ui/components/chat/pebbles/VideoCaptions";
import PebblesVideoContainer from "@/ui/components/chat/pebbles/VideoContainer";
import { motion } from "motion/react";

export default function ChatConversationLayout() {
  const { currentVideo, setCurrentVideo, videoRef } = useSpeechContext();

  return (
    <motion.div
      key="chat-box"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="flex h-auto w-full flex-1 flex-col items-stretch justify-center overflow-hidden"
    >
      <PebblesVideoContainer>
        {currentVideo === 1 && (
          <PebblesEntryVideo
            videoRef={videoRef}
            onEnded={() => setCurrentVideo((prev) => prev + 1)}
          />
        )}
        {currentVideo === 2 && (
          <PebblesIntroVideo
            videoRef={videoRef}
            onEnded={(currentVideoId) => setCurrentVideo(currentVideoId + 1)}
          />
        )}
      </PebblesVideoContainer>
      <VideoCaptions />
    </motion.div>
  );
}
