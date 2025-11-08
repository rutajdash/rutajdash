import { OutgoingSpeech } from "@/types/content.types";
import type { Socket, WebSocket } from "@/types/server.types";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { SpeechToTextChunkResponseModel } from "@elevenlabs/elevenlabs-js/api";

if (!process.env.ELEVENLABS_API_KEY) {
  throw new Error("ElevenLabs API Key not defined in environment variables");
}

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

function sendSpeechSocketMessage({
  userSocket,
  speechSocket,
  message,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
  message: OutgoingSpeech;
}): void {
  speechSocket.send(
    JSON.stringify({
      context_id: userSocket.id,
      ...message,
    }),
  );
}

export function startSpeechContext({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}) {
  sendSpeechSocketMessage({
    userSocket,
    speechSocket,
    message: {
      text: " ",
    },
  });
}

export function keepSpeechContextAlive({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}) {
  sendSpeechSocketMessage({
    userSocket,
    speechSocket,
    message: {
      text: "",
    },
  });
}

export function sendSpeechChunk({
  userSocket,
  speechSocket,
  text,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
  text: string;
}) {
  sendSpeechSocketMessage({
    userSocket,
    speechSocket,
    message: {
      text,
    },
  });
}

export function flushSpeechContext({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}) {
  sendSpeechSocketMessage({
    userSocket,
    speechSocket,
    message: {
      flush: true,
    },
  });
}

export function closeSpeechContext({
  userSocket,
  speechSocket,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
}) {
  sendSpeechSocketMessage({
    userSocket,
    speechSocket,
    message: {
      close_context: true,
    },
  });
}

export async function getTranscriptionFromPCM16(
  pcm16: Int16Array,
): Promise<string> {
  const transcription = (await elevenlabs.speechToText.convert({
    file: pcm16,
    fileFormat: "pcm_s16le_16",
    modelId: "scribe_v1",
    diarize: false,
    numSpeakers: 1,
  })) as SpeechToTextChunkResponseModel;

  return transcription.text;
}
