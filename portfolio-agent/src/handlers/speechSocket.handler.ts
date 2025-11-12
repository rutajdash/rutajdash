import { Server } from "@/types/server.types";
import WebSocket from "ws";
import { IncomingSpeech } from "../types/content.types";

export default function handleSpeechSocket({
  userSocketServer,
  speechSocketServer,
}: {
  userSocketServer: Server;
  speechSocketServer: WebSocket;
}): void {
  speechSocketServer.on("open", function () {
    console.info(`ElevenLabs WebSocket | Connected`);
  });

  speechSocketServer.on("error", function (error) {
    console.error(
      `ElevenLabs WebSocket | Error: ${error.name} | ${error.message}`,
    );
  });

  speechSocketServer.on("close", function (code, _reason) {
    console.info(`ElevenLabs WebSocket | Disconnected | Code: ${code}`);
    userSocketServer.close();
  });

  speechSocketServer.on("message", function (rawData, _isBinary) {
    const data = JSON.parse(
      Buffer.from(rawData as ArrayBuffer).toString("utf-8"),
    ) as IncomingSpeech;

    if (!data.audio) {
      return;
    }

    const userSocket = userSocketServer.sockets.sockets.get(data.contextId);
    if (!userSocket) {
      console.warn(
        `ElevenLabs WebSocket | No user socket found for contextId: ${data.contextId}`,
      );
      return;
    }

    userSocket.emit("agentAudioChunk", data.audio);
  });
}
