"use client";

import Image from "next/image";
import RDLogo from "@/assets/logos/rd-logo-dark.svg";
import GitHubLogo from "@/assets/logos/github-logo-dark.svg";
import styles from "./page.module.css";
import { useRef, useState } from "react";

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <main className="bg-surface flex min-h-dvh min-w-dvw flex-col items-stretch overflow-hidden">
      <div className="px-6 py-2">
        <div className="flex h-16 w-full flex-row items-center justify-between">
          <Image
            src={RDLogo}
            alt="Rutaj Dash Logo"
            className="h-full w-auto py-1"
          />
          <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-full w-auto cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out">
            <Image
              src={GitHubLogo}
              alt="GitHub Logo"
              className="h-full w-auto p-4"
            />
          </div>
        </div>
      </div>
      <div className="flex h-auto w-full flex-1 flex-col items-stretch justify-center overflow-hidden">
        <div className={`${styles.videoContainer} p-6`}>
          {/* <Image
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwqI9E4lYHUDHtTAvcn8QKg3GZ-hw8EHgFYcG4qrqZR8DvW0Tuxy_RP0WSwFbgN2QgrvQerahh-UyvIiaTGis8YEPQfQLaMA43kewWy3j6klithqplKggJlUlMd5m98xU_dLdmTwWsiZ5Ul2h1ABs1XSl4mr7E2CGsW0py5zRxaQUT-mDuG7RKdMosm5jDn4omBKIyrTTEN2VC8EN2CO7hat6AoO_IBccvzZDowP6np9Yz3TbLBI_kb3fRxoEl8kYYjBrj41mf-7ZG"
            alt="Pebbles"
            width={500}
            height={500}
            className="aspect-square h-auto w-full rounded-4xl"
          /> */}
          <div className="rounded-4xl">
            <button
              type="button"
              className={`bg-primary text-on-primary hover:bg-primary/80 absolute top-1/2 left-1/2 z-10 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full shadow-lg transition ${isPlaying ? "opacity-0" : "opacity-100"} duration-300 ease-in-out`}
              aria-label={isPlaying ? "Pause video" : "Play video"}
              onClick={() => {
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.currentTime = 0;
                  } else {
                    videoRef.current.play();
                  }
                  setIsPlaying((prev) => !prev);
                }
              }}
            >
              <span className="material-symbols-rounded text-3xl">
                {isPlaying ? "pause" : "play_arrow"}
              </span>
            </button>
            <video
              ref={videoRef}
              src="/pebbles/Pebbles-Entry-1.mp4"
              className={isPlaying ? styles.play : ""}
              preload="auto"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center px-6 py-3">
        <div className="bg-primary-container flex h-14 w-full max-w-2xs flex-row items-center justify-evenly rounded-full">
          <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-auto cursor-pointer items-center justify-center rounded-full p-1 transition-colors duration-200 ease-in-out">
            <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
              home
            </span>
          </div>
          <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-full w-auto cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out">
            <span className="material-symbols-rounded text-3xl transition-all duration-200 ease-in-out">
              mic
            </span>
          </div>
          <div className="hover:bg-primary/10 active:bg-primary/20 hover:icon-weight-semibold flex aspect-square h-12 w-auto cursor-pointer items-center justify-center rounded-full p-1 transition-colors duration-200 ease-in-out">
            <span className="material-symbols-rounded text-2xl transition-all duration-200 ease-in-out">
              help
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
