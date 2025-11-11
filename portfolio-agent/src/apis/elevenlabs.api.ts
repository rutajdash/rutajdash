import { OutgoingSpeech } from "@/types/content.types";
import type { Socket, WebSocket } from "@/types/server.types";

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
