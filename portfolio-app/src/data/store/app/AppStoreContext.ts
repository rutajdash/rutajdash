import { createContext, useContext } from "react";
import VideoDB from "./VideoDB";

export enum LoadingState {
  not_started,
  in_progress,
  completed,
  error,
}

interface AppStoreContextProps {
  theme: string;
  setTheme: (theme: string) => void;

  videoDB?: VideoDB;

  loadingState: LoadingState;
  loadingPercentage: number;
}

export const AppStoreContext = createContext<AppStoreContextProps | undefined>(
  undefined,
);

export const useAppStoreContext = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error(
      "useAppStoreContext must be used within an AppStoreProvider",
    );
  }
  return context;
};
