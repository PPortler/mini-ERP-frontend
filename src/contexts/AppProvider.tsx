import React from "react";
import { AuthProvider } from "./AuthContext";
import { LoadingProvider } from "./LoadingContext";

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <LoadingProvider>
        {children}
      </LoadingProvider>
    </AuthProvider>
  );
};