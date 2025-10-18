"use client";

import pebblesData from "@/assets/pebbles.json";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AppStoreContext, LoadingState } from "./AppStoreContext";
import VideoDB from "./VideoDB";

export default function AppStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<string>("dark");

  const [videoDB, setVideoDB] = useState<VideoDB | undefined>(undefined);

  const [loadingState, setLoadingState] = useState<LoadingState>(
    LoadingState.not_started,
  );
  const [loadingPercentage, setLoadingPercentage] = useState<number>(0);

  useEffect(() => {
    const db = VideoDB.initialize();
    db.then((database) => setVideoDB(database));

    return () => {
      db.then((database) => database.closeDB());
    };
  }, []);

  useEffect(() => {
    if (!videoDB) {
      return;
    }
    setLoadingState(LoadingState.in_progress);
    loadVideos(videoDB, setLoadingPercentage)
      .then(() => setLoadingState(LoadingState.completed))
      .catch(() => setLoadingState(LoadingState.error));
  }, [videoDB]);

  return (
    <AppStoreContext.Provider
      value={{
        theme,
        setTheme,
        videoDB,
        loadingState,
        loadingPercentage,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}

async function loadVideos(
  db: VideoDB,
  setLoadingPercentage: Dispatch<SetStateAction<number>>,
): Promise<void> {
  // TODO: remove artificial delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  const futures = pebblesData.videos.map((video) =>
    db.preloadVideo(video.url).then(() => {
      setLoadingPercentage((prev) => prev + 100 / pebblesData.videos.length);
    }),
  );
  await Promise.all(futures);

  // TODO: remove artificial delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return;
}
