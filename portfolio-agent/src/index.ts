import { Server } from "socket.io";
import WebSocket from "ws";
import handleSpeechSocket from "./handlers/speechSocket.handler";
import handleUserSocket from "./handlers/userSocket.handler";
import type {
  DefaultEvents,
  EmittedEvents,
  ReceivedEvents,
  Socket,
  SocketData,
} from "./types/server.types";

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("Google Gemini API Key not defined in environment variables");
}
if (!process.env.ELEVENLABS_API_KEY || !process.env.XI_API_KEY) {
  throw new Error("ElevenLabs API Keys not defined in environment variables");
}

const userSocketServer = new Server<
  ReceivedEvents,
  EmittedEvents,
  DefaultEvents,
  SocketData
>(8000, {
  cleanupEmptyChildNamespaces: true,
  connectionStateRecovery: {
    skipMiddlewares: true,
    maxDisconnectionDuration: 2 * 60 * 1000, // 2 minutes
  },
  path: "/io",
  pingInterval: 1 * 1000, // 1 second
  pingTimeout: 5 * 1000, // 5 seconds
  transports: ["websocket"],
  serveClient: false,
});
const speechSocketServer = new WebSocket(
  "wss://api.elevenlabs.io/v1/text-to-speech/vBKc2FfBKJfcZNyEt1n6/multi-stream-input",
  {
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
    },
  },
);
handleSpeechSocket({
  speechSocketServer,
  userSocketServer,
});

userSocketServer.on("connection", function (userSocket: Socket) {
  console.info(
    `User Socket Server | User ${userSocket.id} | Connected | Total Connections: ${String(userSocketServer.engine.clientsCount)}`,
  );

  handleUserSocket({
    userSocket,
    speechSocket: speechSocketServer,
  });
});

console.info("Socket.IO server running at http://localhost:8000/");

function gracefulShutdown() {
  try {
    console.info("Shutting down server...");
    speechSocketServer.close();
    void userSocketServer.close((error?: Error) => {
      if (error) {
        console.error("Error during Socket.IO server shutdown:", error);
        process.exit(1);
      }
      console.info("Socket.IO server closed.");
      process.exit(0);
    });
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
}

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
