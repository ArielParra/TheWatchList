import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with platform-specific configuration
let auth;

if (Platform.OS === 'web') {
  // For web, use the default auth without persistence configuration
  auth = getAuth(app);
} else {
  // For React Native, try to use getReactNativePersistence if available
  try {
    // Dynamic import to avoid issues when getReactNativePersistence is not available
    const { getReactNativePersistence } = require('firebase/auth');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
  } catch (error: any) {
    // Check if auth is already initialized
    if (error.code === 'auth/already-initialized') {
      auth = getAuth(app);
    } else if (error.message && error.message.includes('getReactNativePersistence')) {
      // Fallback: if getReactNativePersistence is not available, use basic initializeAuth
      console.warn('getReactNativePersistence not available, using basic auth initialization');
      try {
        auth = initializeAuth(app);
      } catch (initError: any) {
        if (initError.code === 'auth/already-initialized') {
          auth = getAuth(app);
        } else {
          throw initError;
        }
      }
    } else {
      throw error;
    }
  }
}

// Export the auth instance
export { auth };

// Initialize other Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
