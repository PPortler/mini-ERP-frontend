import { createContext, useContext, useState } from "react";

type LoadingContextType = {
  openLoading: boolean;
  setOpenLoading: (open: boolean) => void;
};

const LoadingContext = createContext<LoadingContextType | null>(null);

export const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [openLoading, setOpenLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ openLoading, setOpenLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

LoadingProvider.useLoading = () => {
  const ctx = useContext(LoadingContext);
  if (!ctx) throw new Error("useLoading must be used inside LoadingProvider");
  return ctx;
};