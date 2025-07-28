import { Toaster } from "@/components/ui/sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      expand={false}
      toastOptions={{
        style: {
          fontSize: '14px',
          lineHeight: '1.4',
        },
      }}
    />
  );
}
