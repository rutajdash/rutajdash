"use client";

import {
  LoadingState,
  useAppStoreContext,
} from "@/data/store/app/AppStoreContext";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import LoadingErrorLayout from "./ErrorLayout";
import LoadingProgressLayout from "./ProgressLayout";
import LoadingReadyLayout from "./ReadyLayout";

export default function LoadingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loadingState, loadingPercentage } = useAppStoreContext();

  const [isActive, setIsActive] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {(loadingState === LoadingState.not_started ||
        loadingState === LoadingState.in_progress) &&
        !isActive && (
          <LoadingProgressLayout loadingPercentage={loadingPercentage} />
        )}
      {loadingState === LoadingState.completed && !isActive && (
        <LoadingReadyLayout setIsActive={setIsActive} />
      )}
      {loadingState === LoadingState.error && <LoadingErrorLayout />}
      {loadingState === LoadingState.completed && isActive && children}
    </AnimatePresence>
  );
}
