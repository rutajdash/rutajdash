import type { Content } from "@google/genai";
import type {
  DefaultEventsMap,
  Server as _Server,
  Socket as _Socket,
} from "socket.io";

export type ReceivedEvents = {
  userMessage: (message: string) => void;
};

export type EmittedEvents = {
  agentTextChunk: (textChunk: string) => void;
  agentAudioChunk: (audioChunk: string) => void;
  agentResponseEnd: (message: string) => void;
};

export type SocketData = {
  history: Content[];
  keepAliveInterval?: NodeJS.Timeout;
};

export type Server = _Server<
  ReceivedEvents,
  EmittedEvents,
  DefaultEventsMap,
  SocketData
>;

export type Socket = _Socket<
  ReceivedEvents,
  EmittedEvents,
  DefaultEventsMap,
  SocketData
>;

export type {
  DefaultEventsMap as DefaultEvents,
  DisconnectReason,
} from "socket.io";

export type { WebSocket } from "ws";
