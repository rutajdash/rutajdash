"use client";

import ChatBottomBar from "@/ui/components/chat/BottomBar";
import ChatHeader from "@/ui/components/chat/Header";
import PebblesEntryVideo from "@/ui/components/chat/pebbles/EntryVideo";
import PebblesIntroVideo from "@/ui/components/chat/pebbles/IntroVideo";
import PebblesVideoContainer from "@/ui/components/chat/pebbles/VideoContainer";
import * as motion from "motion/react-client";
import { useEffect, useRef, useState } from "react";
import LoadingLayout from "../loading";

export default function ChatLayout() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoId, setVideoId] = useState<number>(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play();
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [videoId]);

  return (
    <>
      <ChatHeader />
      <LoadingLayout videoRef={videoRef}>
        <motion.div
          key="chat-box"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="flex h-auto w-full flex-1 flex-col items-stretch justify-center overflow-hidden"
        >
          <PebblesVideoContainer>
            {videoId === 1 && (
              <PebblesEntryVideo
                videoRef={videoRef}
                onEnded={(currentVideoId) => setVideoId(currentVideoId + 1)}
              />
            )}
            {videoId === 2 && (
              <PebblesIntroVideo
                videoRef={videoRef}
                onEnded={(currentVideoId) => setVideoId(currentVideoId + 1)}
              />
            )}
          </PebblesVideoContainer>
        </motion.div>
        <ChatBottomBar />
      </LoadingLayout>
    </>
  );
}
