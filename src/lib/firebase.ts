import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type Auth,
  type User,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             ?? '',
};

// Guard: don't crash if env vars are missing (dev without Firebase configured)
let app: FirebaseApp;
let auth: Auth;

try {
  app  = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
  auth = getAuth(app);
} catch (e) {
  console.warn('[AI Compass] Firebase not configured. Add VITE_FIREBASE_* env vars to enable auth.', e);
  // Provide a stub so imports don't crash
  auth = {} as Auth;
}

export { auth, onAuthStateChanged };

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  return signInWithPopup(auth, provider);
}

export async function signOutUser() {
  return signOut(auth);
}

export type { User };
