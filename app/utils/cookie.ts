import Cookies from 'js-cookie';

// SSR-safe cookie utilities using js-cookie
export function setCookie(name: string, value: string, days = 7) {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    Cookies.set(name, value, { 
      expires: days,
      path: '/',
      sameSite: 'lax',
      secure: window.location.protocol === 'https:'
    });
    
    // Verify the cookie was set
    setTimeout(() => {
      const verification = getCookie(name);
      console.log('Cookie verification for', name, ':', verification ? 'Success' : 'Failed');
    }, 10);
  } catch (error) {
    console.error('Error setting cookie with js-cookie:', error);
  }
}

export function getCookie(name: string): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    return Cookies.get(name) || '';
  } catch (error) {
    console.error('Error getting cookie with js-cookie:', error);
    return '';
  }
}

export function deleteCookie(name: string) {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    Cookies.remove(name, { path: '/' });
    console.log('Cookie deleted with js-cookie:', name);
  } catch (error) {
    console.error('Error deleting cookie with js-cookie:', error);
  }
}

// Debug function to check cookie operations
export function debugCookies() {
  if (typeof window === 'undefined') {
    console.log('Cookies: Server-side environment');
    return;
  }
  
  try {
    console.log('=== COOKIE DEBUG ===');
    console.log('All cookies:', document.cookie);
    console.log('Auth token:', getCookie('auth_token'));
    console.log('js-cookie available:', !!Cookies);
  } catch (error) {
    console.error('Error debugging cookies:', error);
  }
}