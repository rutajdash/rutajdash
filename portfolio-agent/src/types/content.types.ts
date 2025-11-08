export type IncomingSpeech = {
  contextId: string;
  isFinal: boolean;
} & (
  | {
      isFinal: true;
      audio?: never;
      normalizedAlignment?: never;
      alignment?: never;
    }
  | {
      isFinal: false;
      audio: string;
      normalizedAlignment?: AlignmentData;
      alignment?: AlignmentData;
    }
);

export type OutgoingSpeech =
  | {
      text: string;
      flush?: never;
      close_context?: never;
    }
  | {
      flush: true;
      text?: never;
      close_context?: never;
    }
  | {
      close_context: true;
      text?: never;
      flush?: never;
    };

type AlignmentData = {
  charStartTimeMs?: number[];
  charDurationMs?: number[];
  chars?: string[];
};

export type { Content } from "@google/genai";
