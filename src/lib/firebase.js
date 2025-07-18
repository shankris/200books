// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDcm4GrInchY88xN-sKg_a02xlL7fGjK_A",
  authDomain: "books-41c32.firebaseapp.com",
  projectId: "books-41c32",
  storageBucket: "books-41c32.firebasestorage.app",
  messagingSenderId: "370998263696",
  appId: "1:370998263696:web:fba489380e8b1558c8fd15",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
const db = getFirestore(app);

// Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider };
