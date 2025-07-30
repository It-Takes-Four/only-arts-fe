import { useState, useEffect } from 'react';
import { createAuthenticatedImageUrl, createAuthenticatedImageBlob, revokeBlobUrl } from '../../utils/image-auth';

interface UseAuthenticatedImageOptions {
  useBlob?: boolean; // Whether to use blob URLs for better security
  fallbackUrl?: string; // Fallback URL if authentication fails
}

interface UseAuthenticatedImageReturn {
  imageUrl: string | null;
  isLoading: boolean;
  error: string | null;
  retry: () => void;
}

export function useAuthenticatedImage(
  imageFileId: string | null,
  options: UseAuthenticatedImageOptions = {}
): UseAuthenticatedImageReturn {
  const { useBlob = false, fallbackUrl } = options;
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadImage = async () => {
    if (!imageFileId) {
      setImageUrl(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (useBlob) {
        // Use blob approach for better security
        const blobUrl = await createAuthenticatedImageBlob(imageFileId);
        setImageUrl(blobUrl);
      } else {
        // Use query parameter approach for simplicity
        const url = createAuthenticatedImageUrl(imageFileId);
        setImageUrl(url);
      }
    } catch (err) {
      console.error('Failed to load authenticated image:', err);
      setError(err instanceof Error ? err.message : 'Failed to load image');
      
      // Use fallback URL if provided
      if (fallbackUrl) {
        setImageUrl(fallbackUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const retry = () => {
    loadImage();
  };

  useEffect(() => {
    loadImage();

    // Cleanup blob URLs on unmount
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        revokeBlobUrl(imageUrl);
      }
    };
  }, [imageFileId]);

  // Cleanup blob URLs when imageUrl changes
  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith('blob:')) {
        revokeBlobUrl(imageUrl);
      }
    };
  }, [imageUrl]);

  return {
    imageUrl,
    isLoading,
    error,
    retry
  };
}
