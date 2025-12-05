import React from "react";
import { LoadingProvider } from "./LoadingContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
      <LoadingProvider>
        {children}
      </LoadingProvider>
  );
};