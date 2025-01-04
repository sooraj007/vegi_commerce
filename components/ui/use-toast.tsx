import { Toast } from "@/components/ui/toast";
import { useState, useCallback, type ReactNode } from "react";

type ToastProps = {
  message: string | ReactNode;
  duration?: number;
  type?: "success" | "error" | "info";
};

export function useToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [toastProps, setToastProps] = useState<ToastProps>({ message: "" });

  const toast = useCallback(
    ({ message, duration = 3000, type = "info" }: ToastProps) => {
      setToastProps({ message, duration, type });
      setIsVisible(true);

      setTimeout(() => {
        setIsVisible(false);
      }, duration);
    },
    []
  );

  const ToastComponent = isVisible ? (
    <Toast
      message={toastProps.message}
      type={toastProps.type}
      onClose={() => setIsVisible(false)}
    />
  ) : null;

  return { toast, ToastComponent };
}
