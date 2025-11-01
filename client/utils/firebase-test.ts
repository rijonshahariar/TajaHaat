import { auth } from '@/lib/firebase';
import { RecaptchaVerifier } from 'firebase/auth';

export const testFirebaseConfig = () => {
  console.log('Firebase Auth instance:', auth);
  console.log('Firebase Auth app:', auth.app);
  console.log('Firebase Auth config:', {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.substring(0, 10) + '...',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  });
  
  // Test if the auth domain is accessible
  const currentDomain = window.location.hostname;
  console.log('Current domain:', currentDomain);
  console.log('Auth domain:', import.meta.env.VITE_FIREBASE_AUTH_DOMAIN);
  
  // Check if we're running on localhost
  if (currentDomain === 'localhost' || currentDomain === '127.0.0.1') {
    console.log('✅ Running on localhost - should be authorized');
  } else {
    console.log('⚠️ Running on:', currentDomain, '- make sure this domain is authorized in Firebase Console');
  }
};

export const checkReCaptchaContainer = () => {
  const container = document.getElementById('recaptcha-container');
  console.log('reCAPTCHA container:', container);
  if (container) {
    console.log('Container innerHTML:', container.innerHTML);
    console.log('Container children:', container.children.length);
  }
  return container !== null;
};

export const testRecaptchaCreation = () => {
  try {
    const container = document.getElementById('recaptcha-container');
    if (!container) {
      console.error('❌ reCAPTCHA container not found');
      return false;
    }

    // Clear any existing content
    container.innerHTML = '';

    const recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'normal',
      callback: (response: any) => {
        console.log('✅ reCAPTCHA solved:', response);
      },
      'expired-callback': () => {
        console.log('❌ reCAPTCHA expired');
      }
    });

    console.log('✅ RecaptchaVerifier created successfully');
    return recaptchaVerifier;
  } catch (error) {
    console.error('❌ Error creating RecaptchaVerifier:', error);
    return false;
  }
};
