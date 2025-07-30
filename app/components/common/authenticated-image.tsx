import React from 'react';
import { useAuthenticatedImage } from '../hooks/useAuthenticatedImage';
import { cn } from '@/lib/utils';

interface AuthenticatedImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src' | 'onError'> {
  imageFileId: string | null;
  alt: string;
  fallbackUrl?: string;
  useBlob?: boolean;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onLoadStart?: () => void;
  onLoadEnd?: () => void;
  onError?: (error: string) => void;
  onImageError?: React.ReactEventHandler<HTMLImageElement>; // Native img onError
}

export function AuthenticatedImage({
  imageFileId,
  alt,
  fallbackUrl,
  useBlob = false,
  loadingComponent,
  errorComponent,
  onLoadStart,
  onLoadEnd,
  onError,
  onImageError,
  className,
  ...props
}: AuthenticatedImageProps) {
  const { imageUrl, isLoading, error, retry } = useAuthenticatedImage(imageFileId, {
    useBlob,
    fallbackUrl
  });

  React.useEffect(() => {
    if (isLoading && onLoadStart) {
      onLoadStart();
    } else if (!isLoading && onLoadEnd) {
      onLoadEnd();
    }
  }, [isLoading, onLoadStart, onLoadEnd]);

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  // Show loading state
  if (isLoading && loadingComponent) {
    return <>{loadingComponent}</>;
  }

  // Show error state
  if (error && !imageUrl && errorComponent) {
    return <>{errorComponent}</>;
  }

  // Show default loading or error if no custom components provided
  if (isLoading) {
    return (
      <div className={cn("flex items-center justify-center bg-muted rounded", className)}>
        <div className="text-xs text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (error && !imageUrl) {
    return (
      <div className={cn("flex flex-col items-center justify-center bg-muted rounded p-2", className)}>
        <div className="text-xs text-muted-foreground mb-1">Failed to load image</div>
        <button 
          onClick={retry}
          className="text-xs text-primary hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  // Don't render anything if no image URL
  if (!imageUrl) {
    return null;
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={onImageError}
      {...props}
    />
  );
}
