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
    history: [] as Content[],
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
