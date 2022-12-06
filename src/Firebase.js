import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// import firebase from "firebase"

const firebaseConfig = {
  apiKey: "AIzaSyDklaBXDQFF7Fvx7f1C0e7LS4M8Do2P7NY",
  authDomain: "whatsapp-clone-38696.firebaseapp.com",
  projectId: "whatsapp-clone-38696",
  storageBucket: "whatsapp-clone-38696.appspot.com",
  messagingSenderId: "376821785337",
  appId: "1:376821785337:web:06e71edfda493ca8cf7828",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
// Create a root reference
export const storage = getStorage();
export const db = getFirestore();
export const provider = new GoogleAuthProvider();
