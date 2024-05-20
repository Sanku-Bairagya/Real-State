// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-realstate-777e0.firebaseapp.com",
  projectId: "mern-realstate-777e0",
  storageBucket: "mern-realstate-777e0.appspot.com",
  messagingSenderId: "428859452790",
  appId: "1:428859452790:web:05f949347ffeb8355d5e57"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);