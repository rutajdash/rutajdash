import AgentProvider from "@/data/store/agent/AgentProvider";
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
          <AgentProvider>
            <ChatConversationLayout key="chat-conversation-layout" />
            <ChatBottomBar key="chat-bottom-bar-layout" />
          </AgentProvider>
        </LoadingLayout>
      </SpeechProvider>
    </>
  );
}
