import { createContext, useContext } from "react";

interface AgentContextProps {
  agent?: undefined;
}

export const AgentContext = createContext<AgentContextProps | undefined>(
  undefined,
);

export const useAgentContext = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgentContext must be used within a AgentProvider");
  }
  return context;
};
