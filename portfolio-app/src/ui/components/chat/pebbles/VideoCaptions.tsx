"use client";

import { useSpeechContext } from "@/data/store/speech/SpeechContext";

import { Fragment } from "react";

export default function VideoCaptions() {
  const { speechText } = useSpeechContext();
  return (
    <div className="px-4 pt-3">
      <div className="bg-surface-container-high max-h-40 min-h-20 overflow-scroll rounded-2xl px-2 py-2">
        <p className="text-on-surface-variant text-sm">
          {speechText.map((text) => (
            <Fragment key={text}>
              {text}
              <br />
            </Fragment>
          ))}
        </p>
      </div>
    </div>
  );
}
