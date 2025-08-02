export interface ShareData {
  title: string;
  text?: string;
  url: string;
  imageUrl?: string;
}

export interface ShareOptions {
  fallbackMessage?: string;
  trackEvent?: (platform: string) => void;
}

/**
 * Check if the Web Share API is supported
 */
export const isWebShareSupported = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

/**
 * Native web share using the Web Share API
 */
export const shareNative = async (data: ShareData): Promise<boolean> => {
  if (!isWebShareSupported()) {
    return false;
  }

  try {
    await navigator.share({
      title: data.title,
      text: data.text,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled the share or error occurred
    console.warn('Native share failed:', error);
    return false;
  }
};

/**
 * Copy to clipboard as fallback
 */
export const copyToClipboard = async (
  text: string,
  options?: ShareOptions
): Promise<boolean> => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers or non-HTTPS
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return result;
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Share to specific social media platforms
 */
export const shareToSocialMedia = {
  twitter: (data: ShareData) => {
    const text = encodeURIComponent(data.text || data.title);
    const url = encodeURIComponent(data.url);
    const shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },

  facebook: (data: ShareData) => {
    const url = encodeURIComponent(data.url);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },

  linkedin: (data: ShareData) => {
    const url = encodeURIComponent(data.url);
    const title = encodeURIComponent(data.title);
    const summary = encodeURIComponent(data.text || '');
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },

  reddit: (data: ShareData) => {
    const url = encodeURIComponent(data.url);
    const title = encodeURIComponent(data.title);
    const shareUrl = `https://www.reddit.com/submit?url=${url}&title=${title}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },

  whatsapp: (data: ShareData) => {
    const text = encodeURIComponent(`${data.title} ${data.url}`);
    const shareUrl = `https://wa.me/?text=${text}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },

  telegram: (data: ShareData) => {
    const text = encodeURIComponent(data.title);
    const url = encodeURIComponent(data.url);
    const shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  },
};

/**
 * Main share function that tries native share first and falls back to social sharing
 */
export const shareContent = async (
  data: ShareData,
  options?: ShareOptions
): Promise<{ success: boolean; method: string }> => {
  // Try native share first
  if (isWebShareSupported()) {
    const success = await shareNative(data);
    if (success) {
      options?.trackEvent?.('native');
      return { success: true, method: 'native' };
    }
  }

  // Fallback to copying URL to clipboard
  const shareText = data.text 
    ? `${data.title} - ${data.text} ${data.url}`
    : `${data.title} ${data.url}`;
    
  const success = await copyToClipboard(shareText, options);
  if (success) {
    options?.trackEvent?.('clipboard');
    return { success: true, method: 'clipboard' };
  }

  return { success: false, method: 'none' };
};

/**
 * Generate artwork share data
 */
export const generateArtworkShareData = (artwork: {
  id: string;
  title: string;
  description?: string;
  artist: {
    artistName: string;
  };
  imageFileId?: string;
}): ShareData => {
  const url = `${window.location.origin}/art/${artwork.id}`;
  
  return {
    title: `${artwork.title} by ${artwork.artist.artistName}`,
    text: artwork.description 
      ? `Check out this amazing artwork: ${artwork.description}`
      : `Check out this amazing artwork by ${artwork.artist.artistName}`,
    url,
    imageUrl: artwork.imageFileId 
      ? `${window.location.origin}/api/files/${artwork.imageFileId}`
      : undefined,
  };
};
