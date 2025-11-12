import {
  closeSpeechContext,
  keepSpeechContextAlive,
  startSpeechContext,
} from "@/apis/elevenlabs.api";
import { getAgentResponse, handleAgentResponse } from "@/apis/gemini.api";
import { Content } from "@/types/content.types";
import { DisconnectReason, Socket, WebSocket } from "@/types/server.types";

export default function handleUserSocket({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}): void {
  userSocket.data = {
    history: [
      {
        role: "model",
        parts: [
          {
            text: "Hey, I'm Pebbles! As Mr.Dash's personal assistant, I have access to his resume, portfolio and projects. I can help you with things like telling you more about him, if you want, or about his projects, how they're going and the latest updates. I may be a penguin, but I promise I'm smart. So, what can I help you with today?",
          },
        ],
      },
    ] as Content[],
  };

  startSpeechContext({
    userSocket,
    speechSocket,
  });

  userSocket.data.keepAliveInterval = setInterval(
    () =>
      keepSpeechContextAlive({
        userSocket,
        speechSocket,
      }),
    1000,
  );

  userSocket.on("disconnect", function (reason: DisconnectReason) {
    console.info(
      `User Socket Server | User ${userSocket.id} | Disconnected | Reason: ${reason}`,
    );
    closeSpeechContext({
      userSocket,
      speechSocket,
    });
    if (userSocket.data.keepAliveInterval) {
      clearInterval(userSocket.data.keepAliveInterval);
    }
  });

  userSocket.on("userMessage", async function (message: string) {
    const messageStream = await getAgentResponse({
      history: userSocket.data.history,
      message,
    });

    const agentResponse = await handleAgentResponse({
      userSocket,
      speechSocket,
      messageStream,
    });

    userSocket.data.history.push(
      {
        role: "user",
        parts: [
          {
            text: message,
          },
        ],
      },
      {
        role: "model",
        parts: [
          {
            text: agentResponse,
          },
        ],
      },
    );

    userSocket.emit("agentResponseEnd", agentResponse);
  });
}
