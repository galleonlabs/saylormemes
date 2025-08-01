import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getAnalytics, logEvent as firebaseLogEvent } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export const logEvent = (eventName: string, parameters?: any) => {
  firebaseLogEvent(analytics, eventName, parameters);
};