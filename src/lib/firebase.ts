import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { 
  getFirestore, 
  Firestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc,
  getDocFromServer,
  query
} from "firebase/firestore";

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;
let isEnabled = false;

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyB373Qlu3C2CbFHys_wccKftheJvjFKeDs",
  authDomain: "mihret-agency.firebaseapp.com",
  projectId: "mihret-agency",
  storageBucket: "mihret-agency.firebasestorage.app",
  messagingSenderId: "87746052882",
  appId: "1:87746052882:web:e6786ccf173103e58fe9cb",
  measurementId: "G-5E0X37FD6D"
};

// Attempt to load from localStorage or environment
export function getFirebaseConfig() {
  const saved = localStorage.getItem("mihret_firebase_config");
  if (saved === "disconnected") {
    return null;
  }
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // fallback
    }
  }
  return DEFAULT_FIREBASE_CONFIG; // Fallback to your custom Firebase config by default
}

export function initializeFirebase() {
  const config = getFirebaseConfig();
  if (!config || !config.apiKey || !config.projectId) {
    isEnabled = false;
    app = null;
    db = null;
    auth = null;
    return false;
  }

  try {
    if (getApps().length === 0) {
      app = initializeApp(config);
    } else {
      app = getApp();
    }
    db = getFirestore(app);
    auth = getAuth(app);
    isEnabled = true;
    return true;
  } catch (error) {
    console.error("Failed to initialize Firebase with provided config:", error);
    isEnabled = false;
    app = null;
    db = null;
    auth = null;
    return false;
  }
}

// Initial attempt
initializeFirebase();

export { app, db, auth, isEnabled };

// Helper to check actual server connection
export async function testFirestoreConnection(): Promise<boolean> {
  if (!db) return false;
  try {
    // Attempt a live fetch from a test collection/document
    await getDocFromServer(doc(db, "mihret_system", "ping"));
    return true;
  } catch (error: any) {
    console.warn("Firestore test ping returned an error (expected if rules are not set yet or offline):", error.message);
    // If the error is just missing permissions, the connection itself is successful but needs correct rules
    if (error.code === "permission-denied" || error.message.includes("permissions") || error.message.includes("rules")) {
      return true; 
    }
    return false;
  }
}

// Sync operations for candidates pipeline database
export async function fetchCandidatesFromCloud(): Promise<any[] | null> {
  if (!db) return null;
  try {
    const q = collection(db, "candidates");
    const snapshot = await getDocs(q);
    const list: any[] = [];
    snapshot.forEach((docSnap) => {
      list.push(docSnap.data());
    });
    return list;
  } catch (error) {
    console.error("Error fetching candidates from Firestore:", error);
    throw error;
  }
}

export async function fetchCandidateFromCloud(passport: string): Promise<any | null> {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, "candidates", passport.trim().toUpperCase()));
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching single candidate from Firestore:", error);
    return null;
  }
}

export async function saveCandidateToCloud(candidate: any): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, "candidates", candidate.passport), candidate);
  } catch (error) {
    console.error("Error saving candidate to Firestore:", error);
    throw error;
  }
}

export async function deleteCandidateFromCloud(passport: string): Promise<void> {
  if (!db) return;
  try {
    await deleteDoc(doc(db, "candidates", passport));
  } catch (error) {
    console.error("Error deleting candidate from Firestore:", error);
    throw error;
  }
}

// Sync operations for CMS translations
export async function saveTranslationsToCloud(translations: any): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, "settings", "translations"), { data: translations });
  } catch (error) {
    console.error("Error saving translations to Firestore:", error);
    throw error;
  }
}

export async function fetchTranslationsFromCloud(): Promise<any | null> {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, "settings", "translations"));
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching translations from Firestore:", error);
    return null;
  }
}

// Sync operations for Images
export async function saveImagesToCloud(images: any): Promise<void> {
  if (!db) return;
  try {
    await setDoc(doc(db, "settings", "images"), { data: images });
  } catch (error) {
    console.error("Error saving images to Firestore:", error);
    throw error;
  }
}

export async function fetchImagesFromCloud(): Promise<any | null> {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, "settings", "images"));
    if (docSnap.exists()) {
      return docSnap.data().data;
    }
    return null;
  } catch (error) {
    console.error("Error fetching images from Firestore:", error);
    return null;
  }
}
