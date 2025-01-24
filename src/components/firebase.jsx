// firebase.js (v9+ Syntax)
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";




// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBLHODv6hQGHJ_0l7F53KN-8UvGJG1X2qw",
  authDomain: "writify-9594d.firebaseapp.com",
  projectId: "writify-9594d",
  storageBucket: "writify-9594d.firebasestorage.app",
  messagingSenderId: "560071223793",
  appId: "1:560071223793:web:c79db80392d921b3757c50",
  measurementId: "G-VDH525S8R8"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);


// Export Firestore and Storage
export  { db };