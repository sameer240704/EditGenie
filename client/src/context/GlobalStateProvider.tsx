import React, { createContext, useContext, useState, ReactNode } from "react";

interface GlobalStateContextType {
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string>>;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(
  undefined
);

export const useGlobalState = (): GlobalStateContextType => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateProvider");
  }
  return context;
};

interface GlobalStateProviderProps {
  children: ReactNode;
}

export const GlobalStateProvider: React.FC<GlobalStateProviderProps> = ({
  children,
}) => {
  const [selected, setSelected] = useState<string>("");

  return (
    <GlobalStateContext.Provider value={{ selected, setSelected }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
