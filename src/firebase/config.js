// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAast-KhTB8yrt9YqqmAbEzhFLpbkTkN08",
  authDomain: "muso-ninja-72b51.firebaseapp.com",
  projectId: "muso-ninja-72b51",
  storageBucket: "muso-ninja-72b51.appspot.com",
  messagingSenderId: "29385740476",
  appId: "1:29385740476:web:e81c28f09162f4331600b9",
  measurementId: "G-LH64SXQL5K"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

