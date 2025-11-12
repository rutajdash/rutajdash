import AgentProvider from "@/data/store/agent/AgentProvider";
import AudioProvider from "@/data/store/audio/AudioProvider";
import SpeechProvider from "@/data/store/speech/SpeechProvider";
import ChatBottomBar from "@/ui/components/chat/BottomBar";
import ChatHeader from "@/ui/components/chat/Header";
import LoadingLayout from "../loading";
import ChatConversationLayout from "./ConversationLayout";

export default function ChatLayout() {
  return (
    <>
      <ChatHeader />
      <SpeechProvider>
        <LoadingLayout>
          <ChatConversationLayout />
          <AudioProvider>
            <AgentProvider>
              <ChatBottomBar />
            </AgentProvider>
          </AudioProvider>
        </LoadingLayout>
      </SpeechProvider>
    </>
  );
}
