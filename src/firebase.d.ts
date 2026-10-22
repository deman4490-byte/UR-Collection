import { Firestore } from 'firebase/firestore';
import { Auth } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

export const db: Firestore;
export const auth: Auth;
declare const app: FirebaseApp;
export default app;
