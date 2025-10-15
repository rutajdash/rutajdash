"use client";

import clickIcon from "@/assets/click.gif";
import { motion } from "motion/react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

export default function LoadingReady({
  setIsActive,
}: {
  setIsActive: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      <div className="h-40 w-full"></div>
      <motion.div
        key="loaded-layout"
        className="flex h-auto w-full flex-1 flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -50 }}
        onClick={() => setIsActive(true)}
      >
        <h1 className="text-on-surface font-heading mb-2 text-center text-2xl font-bold">
          Connected to Mr. Dash&apos;s Office
        </h1>
        <p className="text-on-surface font-subheading text-center text-base">
          Click anywhere to speak to Pebbles.
        </p>
        <Image src={clickIcon} alt="Click to start" />
      </motion.div>
      <div className="flex h-40 w-full flex-col items-center justify-end px-6 pb-10">
        <p className="text-on-surface font-subheading text-center text-sm">
          This is an interactive and animated experience. <br />
          For the best experience, <br />
          Use headphones and adjust your volume.
        </p>
      </div>
    </>
  );
}
