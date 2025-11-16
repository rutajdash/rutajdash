import { geminiConfig } from "@/configs/gemini.config";
import type { Content } from "@/types/content.types";
import { Socket, WebSocket } from "@/types/server.types";
import {
  FunctionCall,
  FunctionResponse,
  GenerateContentResponse,
  GoogleGenAI,
  PartListUnion,
} from "@google/genai";
import { flushSpeechContext, sendSpeechChunk } from "./elevenlabs.api";
import fetchProjects from "./github/fetchProjects.api";
import getProjectInformation from "./github/getProjectInformation.api";

if (!process.env.GOOGLE_GENAI_API_KEY) {
  throw new Error("Google Gemini API Key not defined in environment variables");
}

const google = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

export async function getAgentResponse({
  history,
  message,
}: {
  history: Content[];
  message: PartListUnion;
}): Promise<AsyncGenerator<GenerateContentResponse>> {
  const chat = google.chats.create({
    model: "gemini-2.5-flash",
    config: geminiConfig,
    history,
  });

  const responseStream = await chat.sendMessageStream({
    message,
  });

  return responseStream;
}

export async function handleAgentResponse({
  userSocket,
  speechSocket,
  messageStream,
}: {
  userSocket: Socket;
  speechSocket: WebSocket;
  messageStream: AsyncGenerator<GenerateContentResponse>;
}): Promise<{
  text: string;
  functionCalls: FunctionCall[];
  functionResponses: FunctionResponse[];
}> {
  const textChunks: string[] = [];
  const functionCalls: FunctionCall[] = [];
  const functionResponses: Promise<FunctionResponse>[] = [];

  for await (const responsePart of messageStream) {
    // TODO: handle function calls and other response parts

    if (responsePart.functionCalls) {
      functionCalls.push(...responsePart.functionCalls);
      functionResponses.push(
        ...handleFunctionCalls(responsePart.functionCalls),
      );
    }

    const content =
      responsePart.candidates?.[0]?.content?.parts?.reduce<string>(
        (acc, part) => acc + (part.text ?? ""),
        "",
      );

    if (!content) {
      continue;
    }

    textChunks.push(content);

    userSocket.emit("agentTextChunk", content);
    sendSpeechChunk({
      userSocket,
      speechSocket,
      text: content,
    });
  }

  flushSpeechContext({
    userSocket,
    speechSocket,
  });

  return {
    text: textChunks.join(" "),
    functionCalls,
    functionResponses: await Promise.all(functionResponses),
  };
}

function handleFunctionCalls(
  functionCalls: FunctionCall[],
): Promise<FunctionResponse>[] {
  const responses: Promise<FunctionResponse>[] = [];

  for (const functionCall of functionCalls) {
    switch (functionCall.name) {
      case "fetchProjects": {
        const fetchProjectsPromise: Promise<FunctionResponse> = fetchProjects(
          functionCall.args?.status as "completed" | "ongoing" | undefined,
        )
          .then<FunctionResponse>((data) => ({
            id: functionCall.id,
            name: functionCall.name,
            response: data.error ? { error: data.message } : { projects: data },
          }))
          .catch((error: unknown) => {
            console.error(`Error in fetchProjects function call:`, error);
            return {
              id: functionCall.id,
              name: functionCall.name,
              response: { error: "An error occurred while fetching projects." },
            };
          });
        responses.push(fetchProjectsPromise);
        break;
      }

      case "getProjectInformation": {
        const getProjectInformationPromise: Promise<FunctionResponse> =
          getProjectInformation(functionCall.args?.projectId as string)
            .then<FunctionResponse>((data) => ({
              id: functionCall.id,
              name: functionCall.name,
              response: data.error
                ? { error: data.message }
                : { project: data },
            }))
            .catch((error: unknown) => {
              console.error(
                `Error in getProjectInformation function call:`,
                error,
              );
              return {
                id: functionCall.id,
                name: functionCall.name,
                response: {
                  error:
                    "An error occurred while fetching project information.",
                },
              };
            });
        responses.push(getProjectInformationPromise);
        break;
      }
      default:
        console.warn(
          `Unknown function call: ${functionCall.name ?? "undefined"}. Ignoring.`,
        );
    }
  }

  return responses;
}
