import { createContext, useContext } from "react";
import VideoDB from "./VideoDB";

interface AppStoreContextProps {
  theme: string;
  setTheme: (theme: string) => void;

  videoDB?: VideoDB;
  setVideoDB: (db: VideoDB) => void;
  videoBlobs: Map<string, Blob>;
  setVideoBlobs: (blobs: Map<string, Blob>) => void;
}

export const AppStoreContext = createContext<AppStoreContextProps | undefined>(
  undefined,
);

export const useAppStoreContext = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
