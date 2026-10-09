import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signOut,
  onAuthStateChanged as _onAuthStateChanged,
  type Auth,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection as _collection,
  doc as _doc,
  getDoc as _getDoc,
  getDocs as _getDocs,
  setDoc as _setDoc,
  updateDoc as _updateDoc,
  deleteDoc as _deleteDoc,
  addDoc as _addDoc,
  query as _query,
  where as _where,
  orderBy as _orderBy,
  limit as _limit,
  onSnapshot as _onSnapshot,
  type Firestore,
  type DocumentData,
  type QueryConstraint,
  type CollectionReference,
  type DocumentReference,
  type Query,
  type QuerySnapshot,
  type DocumentSnapshot,
  type Unsubscribe,
  type SetOptions,
  type UpdateData,
} from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? "",
};

let firebaseReady = false;
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

function isValidFirebaseConfig(cfg: typeof firebaseConfig): boolean {
  return !!(
    cfg.apiKey &&
    cfg.authDomain &&
    cfg.projectId &&
    cfg.storageBucket &&
    cfg.messagingSenderId &&
    cfg.appId
  );
}

try {
  if (isValidFirebaseConfig(firebaseConfig)) {
    app = getApps().length ? getApps()[0]! : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    firebaseReady = true;
  } else {
    console.warn(
      "[AI Compass] Firebase not configured. Set VITE_FIREBASE_* env vars to enable auth, analytics, and admin features.",
    );
    auth = {} as Auth;
    db = {} as Firestore;
    storage = {} as FirebaseStorage;
    firebaseReady = false;
  }
} catch (e) {
  console.warn("[AI Compass] Firebase init failed. Check VITE_FIREBASE_* env vars.", e);
  auth = {} as Auth;
  db = {} as Firestore;
  storage = {} as FirebaseStorage;
  firebaseReady = false;
}

function safeCollection(
  firestore: Firestore,
  path: string,
  ...pathSegments: string[]
): CollectionReference {
  if (!firebaseReady) return undefined as unknown as CollectionReference;
  return _collection(firestore, path, ...pathSegments);
}

function safeDoc(firestore: Firestore, path: string, ...pathSegments: string[]): DocumentReference {
  if (!firebaseReady) return undefined as unknown as DocumentReference;
  return _doc(firestore, path, ...pathSegments);
}

async function safeGetDoc(docRef: DocumentReference): Promise<DocumentSnapshot> {
  if (!firebaseReady || !docRef) {
    return {
      exists: () => false,
      data: () => undefined,
      id: "",
      ref: docRef,
    } as unknown as DocumentSnapshot;
  }
  return _getDoc(docRef);
}

async function safeGetDocs(queryRef: Query): Promise<QuerySnapshot> {
  if (!firebaseReady || !queryRef) {
    return {
      docs: [],
      empty: true,
      size: 0,
      forEach: () => {},
    } as unknown as QuerySnapshot;
  }
  return _getDocs(queryRef);
}

async function safeSetDoc(
  docRef: DocumentReference,
  data: DocumentData,
  options?: SetOptions,
): Promise<void> {
  if (!firebaseReady || !docRef) return;
  return _setDoc(docRef, data, options);
}

async function safeUpdateDoc(docRef: DocumentReference, data: UpdateData): Promise<void> {
  if (!firebaseReady || !docRef) return;
  return _updateDoc(docRef, data);
}

async function safeDeleteDoc(docRef: DocumentReference): Promise<void> {
  if (!firebaseReady || !docRef) return;
  return _deleteDoc(docRef);
}

async function safeAddDoc(
  collectionRef: CollectionReference,
  data: DocumentData,
): Promise<DocumentReference> {
  if (!firebaseReady || !collectionRef) {
    return {
      id: "demo-" + Math.random().toString(36).slice(2, 10),
    } as unknown as DocumentReference;
  }
  return _addDoc(collectionRef, data);
}

function safeQuery(base: Query | CollectionReference, ...constraints: QueryConstraint[]): Query {
  if (!firebaseReady || !base) return undefined as unknown as Query;
  return _query(base, ...constraints);
}

function safeWhere(fieldPath: string, opStr: string, value: unknown): QueryConstraint {
  if (!firebaseReady) return undefined as unknown as QueryConstraint;
  return _where(fieldPath, opStr as never, value);
}

function safeOrderBy(fieldPath: string, directionStr?: "asc" | "desc"): QueryConstraint {
  if (!firebaseReady) return undefined as unknown as QueryConstraint;
  return _orderBy(fieldPath, directionStr);
}

function safeLimit(n: number): QueryConstraint {
  if (!firebaseReady) return undefined as unknown as QueryConstraint;
  return _limit(n);
}

function safeOnSnapshot(
  ref: Query | DocumentReference,
  onNext: (snapshot: unknown) => void,
): Unsubscribe {
  if (!firebaseReady || !ref) return () => {};
  return _onSnapshot(ref as never, onNext as never);
}

function safeOnAuthStateChanged(
  authInstance: Auth,
  callback: (user: User | null) => void,
): ReturnType<typeof _onAuthStateChanged> {
  if (!firebaseReady || !authInstance || typeof authInstance !== "object") {
    callback(null);
    return () => {};
  }
  try {
    return _onAuthStateChanged(authInstance, callback);
  } catch {
    callback(null);
    return () => {};
  }
}

export { auth, db, storage, firebaseReady };
export const onAuthStateChanged = safeOnAuthStateChanged;
export const collection = safeCollection;
export const doc = safeDoc;
export const getDoc = safeGetDoc;
export const getDocs = safeGetDocs;
export const setDoc = safeSetDoc;
export const updateDoc = safeUpdateDoc;
export const deleteDoc = safeDeleteDoc;
export const addDoc = safeAddDoc;
export const query = safeQuery;
export const where = safeWhere;
export const orderBy = safeOrderBy;
export const limit = safeLimit;
export const onSnapshot = safeOnSnapshot;

export async function signInWithGoogle() {
  if (!firebaseReady) {
    throw new Error(
      "Firebase is not configured. Set VITE_FIREBASE_API_KEY and related env vars to enable sign-in.",
    );
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });

  try {
    return await signInWithPopup(auth, provider);
  } catch (err) {
    // Error codes that indicate the popup was blocked or the user
    // cancelled before it opened — fall back to redirect flow which
    // cannot be blocked by browser popup blockers.
    const code = (err as { code?: string })?.code;
    const useRedirect =
      code === "auth/popup-blocked" ||
      code === "auth/popup-closed-by-user" ||
      code === "auth/cancelled-popup-request" ||
      code === "auth/operation-not-allowed" ||
      (code == null && err instanceof Error && /popup|block/i.test(err.message));

    if (useRedirect) {
      // signInWithRedirect returns a promise that resolves AFTER the
      // redirect is initiated — the actual sign-in result is picked up
      // by resolvePendingRedirect() on the next page load.
      return await signInWithRedirect(auth, provider);
    }

    throw err;
  }
}

/**
 * Must be called once on app startup on the client. If the user just came
 * back from a signInWithRedirect() Google flow, this consumes and returns
 * the result so onAuthStateChanged fires correctly. Errors (e.g. user
 * cancelled the redirect flow) are swallowed silently.
 */
export async function resolvePendingRedirect(): Promise<User | null> {
  if (!firebaseReady || typeof window === "undefined") return null;
  try {
    const result = await getRedirectResult(auth);
    return result?.user ?? null;
  } catch {
    return null;
  }
}

export async function signOutUser() {
  if (!firebaseReady) return;
  try {
    return await signOut(auth);
  } catch {
    /* no-op on sign-out failure */
  }
}

export async function getDocData(path: string): Promise<DocumentData | null> {
  try {
    const snap = await getDoc(doc(db, path));
    return snap.exists() ? (snap.data() ?? null) : null;
  } catch {
    return null;
  }
}

export async function getCollectionData(
  path: string,
  constraints: QueryConstraint[] = [],
): Promise<{ id: string; data: DocumentData }[]> {
  try {
    const snap = await getDocs(query(collection(db, path), ...constraints));
    return snap.docs.map((d) => ({ id: d.id, data: d.data() }));
  } catch {
    return [];
  }
}

export type { User };
