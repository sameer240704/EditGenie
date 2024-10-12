import { createContext, useContext, useState, ReactNode } from "react";

type SidebarStateContextType = {
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
};

const SidebarStateContext = createContext<SidebarStateContextType | undefined>(
  undefined
);

export const useSidebarState = () => {
  const context = useContext(SidebarStateContext);
  if (context === undefined) {
    throw new Error(
      "useSidebarState must be used within a SidebarStateProvider"
    );
  }
  return context;
};

export const SidebarStateProvider = ({ children }: { children: ReactNode }) => {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <SidebarStateContext.Provider value={{ expanded, setExpanded }}>
      {children}
    </SidebarStateContext.Provider>
  );
};
