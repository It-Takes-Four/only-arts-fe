import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        // Default options for all toasts
        duration: 4000,
        className: 'toast-glass',
        style: {
          borderRadius: '12px',
          color: 'hsl(var(--foreground))',
          fontWeight: '500',
          padding: '16px 20px',
          minWidth: '320px',
          fontSize: '14px',
          lineHeight: '1.4',
        },
        // Success toast styles
        success: {
          className: 'toast-glass success',
          style: {
            color: 'rgb(34, 197, 94)',
            fontWeight: '600',
          },
          iconTheme: {
            primary: 'rgb(34, 197, 94)',
            secondary: 'rgba(255, 255, 255, 0.95)',
          },
        },
        // Error toast styles
        error: {
          className: 'toast-glass error',
          style: {
            color: 'rgb(239, 68, 68)',
            fontWeight: '600',
          },
          iconTheme: {
            primary: 'rgb(239, 68, 68)',
            secondary: 'rgba(255, 255, 255, 0.95)',
          },
        },
        // Warning/Loading toast styles
        loading: {
          className: 'toast-glass warning',
          style: {
            color: 'rgb(245, 158, 11)',
            fontWeight: '600',
          },
          iconTheme: {
            primary: 'rgb(245, 158, 11)',
            secondary: 'rgba(255, 255, 255, 0.95)',
          },
        },
      }}
    />
  );
}
