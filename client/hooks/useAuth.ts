import { useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  User,
  signOut,
  updateProfile
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { apiService, BackendUser, CreateUserRequest } from '@/lib/apiService';

// Utility function to convert phone numbers to email format
const phoneToEmail = (phoneNumber: string): string => {
  // Remove all non-digit characters and ensure it's exactly 11 digits
  const cleaned = phoneNumber.replace(/[^\d]/g, '');
  
  if (cleaned.length === 11 && cleaned.startsWith('01')) {
    // Convert 01400505738 to 01400505738@gmail.com
    return cleaned + '@gmail.com';
  }
  
  throw new Error('Phone number must be 11 digits starting with 01');
};

// Utility function to extract phone number from email
const emailToPhone = (email: string): string => {
  // Extract 01400505738 from 01400505738@gmail.com
  return email.replace('@gmail.com', '');
};

interface UserData {
  uid: string;
  name: string;
  phone: string;
  password: string;
  role: 'farmer' | 'buyer' | 'admin' | 'driver';
  isPhoneVerified: boolean;
  createdAt: string;
  backendUser?: BackendUser;
}

export interface AuthState {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  error: string | null;
  isOtpSent: boolean;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    userData: null,
    loading: true,
    error: null,
    isOtpSent: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get user data from backend using email
        const phone = user.email ? emailToPhone(user.email) : '';
        const userData = await getUserData(phone);
        setState(prev => ({
          ...prev,
          user,
          userData,
          loading: false,
        }));
      } else {
        setState(prev => ({
          ...prev,
          user: null,
          userData: null,
          loading: false,
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  // Backend API functions
  const saveUserData = async (userData: UserData, createUserRequest?: CreateUserRequest): Promise<BackendUser | null> => {
    try {
      if (createUserRequest) {
        console.log('Creating user in backend:', createUserRequest);
        // Create user in backend during registration
        const backendUser = await apiService.createUser(createUserRequest);
        console.log('Backend user created successfully:', backendUser);
        return backendUser;
      }
      return null;
    } catch (error) {
      console.error('Error saving user data to backend:', error);
      // Re-throw the error so the registration process knows it failed
      throw new Error(`Failed to save user to database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getUserData = async (phone: string): Promise<UserData | null> => {
    try {
      // Try to get user from backend first
      const backendUser = await apiService.getUserByPhone(phone);
      if (backendUser) {
        // Convert backend user to local UserData format
        return {
          uid: backendUser._id || '',
          name: backendUser.fullName,
          phone: backendUser.phoneNumber,
          password: '', // Password is not stored in backend for security
          role: backendUser.role,
          isPhoneVerified: true,
          createdAt: new Date().toISOString(),
          backendUser,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching user data from backend:', error);
      return null;
    }
  };

  // Registration process with email/password
  const startRegistration = async (
    name: string,
    phoneNumber: string,
    password: string,
    role: 'farmer' | 'buyer' | 'driver',
    address: string = '',
    profileImage?: File
  ) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Clean and validate phone number
      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
      console.log('startRegistration - Phone cleaning:', {
        originalPhone: phoneNumber,
        cleanedPhone: cleanPhone,
        cleanedLength: cleanPhone.length,
        isValidFormat: cleanPhone.length === 11 && cleanPhone.startsWith('01')
      });
      
      if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
        throw new Error('Phone number must be 11 digits starting with 01');
      }

      // Convert phone to email format
      const userEmail = phoneToEmail(cleanPhone);
      
      console.log('Registration details:', {
        phoneNumber: cleanPhone,
        email: userEmail,
        name,
        role
      });

      // Check if user already exists in backend
      const existingUser = await apiService.getUserByPhone(cleanPhone);
      if (existingUser) {
        throw new Error('User with this phone number already exists');
      }

      // Store registration data temporarily for OTP verification
      const tempUserData = {
        name,
        phone: cleanPhone,
        password,
        role,
        address,
        profileImage,
        userEmail
      };
      
      sessionStorage.setItem('temp_registration', JSON.stringify({
        ...tempUserData,
        profileImage: undefined, // Can't serialize File object
      }));
      
      // Store image separately if provided
      if (profileImage) {
        sessionStorage.setItem('temp_profile_image', 'true');
        (window as any).tempProfileImage = profileImage;
      }

      setState(prev => ({
        ...prev,
        isOtpSent: true,
        loading: false,
      }));

      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to start registration. Please try again.';
      
      if (error.message === 'User with this phone number already exists') {
        errorMessage = 'User with this phone number already exists. Please login instead.';
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      
      throw error;
    }
  };

  const completeRegistration = async (otp: string) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Check if OTP is the dummy value
      if (otp !== '123456') {
        throw new Error('Invalid OTP. Use 123456 for demo.');
      }
      
      // Get temporary registration data
      const tempData = JSON.parse(sessionStorage.getItem('temp_registration') || '{}');
      const hasProfileImage = sessionStorage.getItem('temp_profile_image') === 'true';
      const profileImage = hasProfileImage ? (window as any).tempProfileImage : undefined;

      console.log('Completing registration with data:', tempData);
      console.log('Complete registration - stored phone details:', {
        storedPhone: tempData.phone,
        storedPhoneLength: tempData.phone?.length,
        storedPhoneType: typeof tempData.phone
      });

      // Create Firebase user with email/password
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        tempData.userEmail, 
        tempData.password
      );
      
      const firebaseUser = userCredential.user;

      // Update Firebase user profile
      await updateProfile(firebaseUser, {
        displayName: tempData.name,
      });

      // Create user in backend
      const createUserRequest: CreateUserRequest = {
        fullName: tempData.name,
        address: tempData.address || 'No address provided',
        phoneNumber: tempData.phone,
        email: tempData.phone + '@gmail.com', // phone@gmail.com format
        role: tempData.role,
        image: profileImage,
      };

      console.log('Attempting to save user to backend...', createUserRequest);
      console.log('Phone number details:', {
        original: tempData.phone,
        length: tempData.phone.length,
        startsWithZeroOne: tempData.phone.startsWith('01'),
        isAllDigits: /^\d+$/.test(tempData.phone),
        cleaned: tempData.phone.replace(/[^\d]/g, ''),
        cleanedLength: tempData.phone.replace(/[^\d]/g, '').length
      });
      
      // Double check and clean the phone number before sending to backend
      const finalCleanPhone = tempData.phone.replace(/[^\d]/g, '');
      if (finalCleanPhone.length !== 11 || !finalCleanPhone.startsWith('01')) {
        throw new Error('Invalid phone number format for backend: ' + finalCleanPhone);
      }
      
      // Update the request with clean phone
      createUserRequest.phoneNumber = finalCleanPhone;
      console.log('Final clean phone number being sent:', finalCleanPhone);
      
      const backendUser = await saveUserData(undefined as any, createUserRequest);
      console.log('User saved to backend successfully:', backendUser);
      
      // Store password locally for login reference (in production, don't store passwords)
      localStorage.setItem(`password_${tempData.phone}`, tempData.password);
      
      // Create user data
      const userData: UserData = {
        uid: firebaseUser.uid,
        name: tempData.name,
        phone: tempData.phone,
        password: tempData.password,
        role: tempData.role,
        isPhoneVerified: true,
        createdAt: new Date().toISOString(),
        backendUser: backendUser || undefined,
      };

      // Clean up
      sessionStorage.removeItem('temp_registration');
      sessionStorage.removeItem('temp_profile_image');
      if ((window as any).tempProfileImage) {
        delete (window as any).tempProfileImage;
      }

      setState(prev => ({
        ...prev,
        user: firebaseUser,
        userData,
        loading: false,
        isOtpSent: false,
      }));

      return firebaseUser;
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message === 'Invalid OTP. Use 123456 for demo.') {
        errorMessage = 'Invalid OTP. Please enter 123456.';
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This phone number is already registered. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      }

      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      
      throw error;
    }
  };

  // Login process with email/password
  const login = async (phoneNumber: string, password: string) => {
    try {
      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      // Clean and validate phone number
      const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
      if (cleanPhone.length !== 11 || !cleanPhone.startsWith('01')) {
        throw new Error('Phone number must be 11 digits starting with 01');
      }

      // Convert phone to email format
      const userEmail = phoneToEmail(cleanPhone);

      console.log('Login attempt:', {
        phoneNumber: cleanPhone,
        email: userEmail
      });

      // Sign in with Firebase using email/password
      const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
      const firebaseUser = userCredential.user;

      // Get user data from backend
      const backendUser = await apiService.getUserByPhone(cleanPhone);
      if (!backendUser) {
        throw new Error('User data not found in database. Please register first.');
      }

      console.log('User found in backend:', backendUser);

      // Create user data from backend response
      const userData: UserData = {
        uid: firebaseUser.uid,
        name: backendUser.fullName,
        phone: backendUser.phoneNumber,
        password: password,
        role: backendUser.role,
        isPhoneVerified: true,
        createdAt: new Date().toISOString(),
        backendUser: backendUser,
      };

      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData));

      setState(prev => ({
        ...prev,
        user: firebaseUser,
        userData,
        loading: false,
      }));

      return firebaseUser;
    } catch (error: any) {
      let errorMessage = 'Login failed. Please check your phone number and password.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'User not found. Please register first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid phone number format.';
      } else if (error.code === 'auth/user-disabled') {
        errorMessage = 'This account has been disabled.';
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
        userData: null,
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
      isOtpSent: false,
    }));
    
    sessionStorage.removeItem('temp_registration');
    sessionStorage.removeItem('temp_profile_image');
  };

  return {
    ...state,
    startRegistration,
    completeRegistration,
    login,
    logout,
    resetState,
  };
};
