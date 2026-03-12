import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyCGni4Tus_J6R3mrWP-UKmyYhQO-gMOTVs",
  authDomain: "zen-finance-fe071.firebaseapp.com",
  projectId: "zen-finance-fe071",
  storageBucket: "zen-finance-fe071.firebasestorage.app",
  messagingSenderId: "166408538142",
  appId: "1:166408538142:web:17f2820c2e22f3c2f4060f",
  measurementId: "G-YLFHEDF5X6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
getAnalytics(app);

export {
  app,
  auth,
  db,
  provider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  doc,
  setDoc,
  getDoc,
};
