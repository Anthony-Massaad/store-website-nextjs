"use client";

import { Toast } from "primereact/toast";
import { FC, ReactNode, createContext, useRef } from "react";

interface ToastProps {
  showToast: (
    severity: "info" | "warn" | "error" | "success",
    summary?: string,
    detail?: string
  ) => void;
}

interface Props {
  children: ReactNode;
}

export const ToastContext = createContext<ToastProps>({} as ToastProps);

const ToastProvider: FC<Props> = ({ children }) => {
  const toast = useRef<Toast>(null);

  const showToast = (
    severity: "info" | "warn" | "error" | "success",
    summary?: string,
    detail?: string
  ) => {
    toast.current?.show({
      severity: severity,
      summary: summary,
      detail: detail,
    });
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
};

export default ToastProvider;
