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
      "xi-api-key":
        process.env.ELEVENLABS_API_KEY ||
        "sk_a6a1d37da8a56f5603b5866956441f30e8f22b86892f5597",
    },
  },
);
handleSpeechSocket({
  speechSocketServer,
  userSocketServer,
});

userSocketServer.on("connection", function (userSocket: Socket) {
  console.info(
    `User Socket Server | User ${userSocket.id} | Connected | Total Connections: ${userSocketServer.engine.clientsCount}`,
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
    speechSocketServer.close(0);
    userSocketServer.close((error?: Error) => {
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
