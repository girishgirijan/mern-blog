// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-216d6.firebaseapp.com",
  projectId: "mern-blog-216d6",
  storageBucket: "mern-blog-216d6.appspot.com",
  messagingSenderId: "819246608255",
  appId: "1:819246608255:web:ab7aab0c797295e825344a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);