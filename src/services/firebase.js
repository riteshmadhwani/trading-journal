import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBBeZOOzl5Ruu1Ai9WIUAfsSZRv3oY2pYY",
  authDomain: "trading-journal-29373.firebaseapp.com",
  projectId: "trading-journal-29373",
  storageBucket: "trading-journal-29373.firebasestorage.app",
  messagingSenderId: "911450233404",
  appId: "1:911450233404:web:706de49f0dccd4e4158139",
  measurementId: "G-H6BZE2JQJZ"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();