import { useState, useEffect } from 'react';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult,
  onAuthStateChanged,
  User,
  signOut
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export interface PhoneAuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  confirmationResult: ConfirmationResult | null;
  isOtpSent: boolean;
}

export const usePhoneAuth = () => {
  const [state, setState] = useState<PhoneAuthState>({
    user: null,
    loading: true,
    error: null,
    confirmationResult: null,
    isOtpSent: false,
  });

  const [recaptchaVerifier, setRecaptchaVerifier] = useState<RecaptchaVerifier | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState(prev => ({
        ...prev,
        user,
        loading: false,
      }));
    });

    return () => unsubscribe();
  }, []);

  const setupRecaptcha = (containerId: string) => {
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, containerId, {
      size: 'normal',
      callback: () => {
        // reCAPTCHA solved, allow signInWithPhoneNumber.
      },
      'expired-callback': () => {
        setState(prev => ({
          ...prev,
          error: 'reCAPTCHA expired. Please try again.',
        }));
      }
    });

    setRecaptchaVerifier(verifier);
    return verifier;
  };

  const sendOtp = async (phoneNumber: string, recaptchaContainerId: string = 'recaptcha-container') => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Format phone number to international format if it's not already
      let formattedPhone = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        // Assuming Bangladesh phone numbers, adjust as needed
        if (phoneNumber.startsWith('01')) {
          formattedPhone = '+880' + phoneNumber.substring(1);
        } else if (phoneNumber.startsWith('880')) {
          formattedPhone = '+' + phoneNumber;
        } else {
          formattedPhone = '+880' + phoneNumber;
        }
      }

      let verifier = recaptchaVerifier;
      if (!verifier) {
        verifier = setupRecaptcha(recaptchaContainerId);
      }

      // Render the reCAPTCHA if it hasn't been rendered yet
      if (verifier && !verifier.type) {
        await verifier.render();
      }

      const confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
      
      setState(prev => ({
        ...prev,
        confirmationResult,
        isOtpSent: true,
        loading: false,
      }));

      return confirmationResult;
    } catch (error: any) {
      console.error('SMS send error:', error);
      let errorMessage = 'Failed to send OTP. Please try again.';
      
      if (error.code === 'auth/invalid-phone-number') {
        errorMessage = 'Invalid phone number format. Please use international format (+880xxxxxxxxx).';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error.code === 'auth/captcha-check-failed') {
        errorMessage = 'reCAPTCHA verification failed. Please try again.';
      } else if (error.code === 'auth/quota-exceeded') {
        errorMessage = 'SMS quota exceeded. Please try again later.';
      } else if (error.code === 'auth/unauthorized-domain') {
        errorMessage = 'This domain is not authorized for Firebase authentication.';
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      
      throw error;
    }
  };

  const verifyOtp = async (otp: string) => {
    if (!state.confirmationResult) {
      throw new Error('No OTP confirmation result available.');
    }

    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      const result = await state.confirmationResult.confirm(otp);
      
      setState(prev => ({
        ...prev,
        user: result.user,
        loading: false,
        isOtpSent: false,
        confirmationResult: null,
      }));

      return result.user;
    } catch (error: any) {
      let errorMessage = 'Invalid OTP. Please try again.';
      
      if (error.code === 'auth/invalid-verification-code') {
        errorMessage = 'Invalid verification code.';
      } else if (error.code === 'auth/code-expired') {
        errorMessage = 'Verification code has expired.';
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setState(prev => ({
        ...prev,
        user: null,
        confirmationResult: null,
        isOtpSent: false,
        error: null,
      }));
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const resetState = () => {
    setState(prev => ({
      ...prev,
      error: null,
      confirmationResult: null,
      isOtpSent: false,
    }));
    
    if (recaptchaVerifier) {
      recaptchaVerifier.clear();
      setRecaptchaVerifier(null);
    }
  };

  return {
    ...state,
    sendOtp,
    verifyOtp,
    logout,
    resetState,
    setupRecaptcha,
  };
};
