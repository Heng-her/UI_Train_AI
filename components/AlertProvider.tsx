"use client";
import { createContext, useContext, useState } from "react";
import { AlertDialog } from "./AlertDialog";

type AlertType = "success" | "warn" | "error";

type AlertState = {
  open: boolean;
  title: string;
  subtitle?: string;
  type: AlertType;
};

type AlertContextType = {
  success: (title: string, subtitle?: string) => void;
  warn: (title: string, subtitle?: string) => void;
  error: (title: string, subtitle?: string) => void;
};

const AlertContext = createContext<AlertContextType | null>(null);

export function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>({
    open: false,
    title: "",
    type: "success",
  });

  const show = (type: AlertType, title: string, subtitle?: string) => {
    setState({ open: true, title, subtitle, type });
  };

  const close = () => setState((s) => ({ ...s, open: false }));

  return (
    <AlertContext.Provider
      value={{
        success: (t, s) => show("success", t, s),
        warn: (t, s) => show("warn", t, s),
        error: (t, s) => show("error", t, s),
      }}
    >
      {children}
      <AlertDialog {...state} onClose={close} />
    </AlertContext.Provider>
  );
}

export const useAlert = () => {
  const ctx = useContext(AlertContext);
  if (!ctx) throw new Error("useAlert must be used inside AlertProvider");
  return ctx;
};
