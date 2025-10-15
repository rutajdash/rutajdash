"use client";

import { useEffect, useState } from "react";
import { AppStoreContext } from "./AppStoreContext";
import VideoDB from "./VideoDB";

export default function AppStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<string>("dark");
  const [videoDB, setVideoDB] = useState<VideoDB | undefined>(undefined);
  const [videoBlobs, setVideoBlobs] = useState<Map<string, Blob>>(new Map());

  useEffect(() => {
    const db = VideoDB.initialize();
    db.then((database) => setVideoDB(database));

    return () => {
      db.then((database) => database.closeDB());
    };
  }, []);

  return (
    <AppStoreContext.Provider
      value={{
        theme,
        setTheme,
        videoDB,
        setVideoDB,
        videoBlobs,
        setVideoBlobs,
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
}
