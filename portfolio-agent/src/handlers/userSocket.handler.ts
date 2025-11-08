import {
  closeSpeechContext,
  getTranscriptionFromPCM16,
  keepSpeechContextAlive,
  startSpeechContext,
} from "@/apis/elevenlabs.api";
import { getAgentResponse, handleAgentResponse } from "@/apis/gemini.api";
import { Content } from "@/types/content.types";
import { DisconnectReason, Socket, WebSocket } from "@/types/server.types";
import { combinePCM16Chunks, getPCM16FromBase64 } from "@/utils/audio.utils";

export default function handleUserSocket({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}): void {
  userSocket.data = {
    audioChunks: [] as Int16Array[],
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

  userSocket.on("userAudioChunk", function (audioChunk: string) {
    // console.debug(
    //   `User Socket Server | User ${userSocket.id} | Audio Chunk Received`,
    // );
    const decodedAudio = getPCM16FromBase64(audioChunk);
    userSocket.data.audioChunks.push(decodedAudio);
  });

  userSocket.on("userSpeechEnd", async function () {
    // console.debug(`User Socket Server | User ${userSocket.id} | Speech End`);

    if (
      !userSocket.data.audioChunks ||
      userSocket.data.audioChunks?.length === 0
    ) {
      console.warn(`No audio data received from socket ${userSocket.id}`);
      return;
    }

    const combinedAudio = combinePCM16Chunks(userSocket.data.audioChunks);
    const transcription = await getTranscriptionFromPCM16(combinedAudio);

    const messageStream = await getAgentResponse({
      history: userSocket.data.history,
      message: transcription,
    });

    const agentResponse = await handleAgentResponse({
      userSocket,
      speechSocket,
      messageStream,
    });

    userSocket.data.audioChunks = [] as Int16Array[];
    userSocket.data.history.push(
      {
        role: "user",
        parts: [
          {
            text: transcription,
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

    userSocket.data.audioChunks = [] as Int16Array[];
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
