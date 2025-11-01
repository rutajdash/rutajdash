"use client";

import { AgentContext } from "./AgentContext";

export default function AgentProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AgentContext.Provider
      value={{
        agent: undefined,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
}
