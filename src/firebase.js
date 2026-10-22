import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyADm0y3DzptwKMC-mjxlJMDjLJIsMkszh0",
  authDomain: "ur-14df5.firebaseapp.com",
  projectId: "ur-14df5",
  storageBucket: "ur-14df5.firebasestorage.app",
  messagingSenderId: "423324457129",
  appId: "1:423324457129:web:b62b48737653f771c3b1b8"
};

// Initialize Firebase (singleton pattern prevents re-initialization during HMR)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Database & Authentication
export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;
