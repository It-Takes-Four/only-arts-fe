import { getCookie } from './cookie';

/**
 * Creates an authenticated image URL that includes the bearer token as a query parameter
 * This is needed because img src attributes cannot include custom headers
 * 
 * Note: The backend should accept authentication via query parameter for the upload endpoint:
 * GET /api/v1/upload/{imageFileId}?token=<bearer_token>
 */
export function createAuthenticatedImageUrl(imageFileId: string): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = getCookie('auth_token');
  
  if (!token) {
    console.warn('No auth token available for image URL');
    // Return URL without token - let the backend handle unauthorized requests
    return `${baseUrl}/upload/${imageFileId}`;
  }
  
  // Include token as query parameter for authenticated image requests
  return `${baseUrl}/upload/${imageFileId}?token=${encodeURIComponent(token)}`;
}

/**
 * Alternative approach: Create a blob URL from an authenticated fetch
 * This is more secure but requires async loading
 */
export async function createAuthenticatedImageBlob(imageFileId: string): Promise<string> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;
  const token = getCookie('auth_token');
  
  if (!token) {
    throw new Error('No auth token available');
  }
  
  try {
    const response = await fetch(`${baseUrl}/upload/${imageFileId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error creating authenticated image blob:', error);
    throw error;
  }
}

/**
 * Clean up blob URLs to prevent memory leaks
 */
export function revokeBlobUrl(url: string) {
  if (url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
}
