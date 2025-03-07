// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAjcp8AJ0aTm6DhYZqhgT6sc3xALTsiCOI",
  authDomain: "revise-studyapp.firebaseapp.com",
  projectId: "revise-studyapp",
  storageBucket: "revise-studyapp.firebasestorage.app",
  messagingSenderId: "433036014890",
  appId: "1:433036014890:web:4ca38a6118b0e594c65a53",
  measurementId: "G-Z8KG4XT1F1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Only initialize analytics on the client side
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

export const auth = getAuth(app);