// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBa7CFRU0OaJWC_2PAXgd4tXDypbY1mtz8",
  authDomain: "ojasbackend.firebaseapp.com",
  projectId: "ojasbackend",
  storageBucket: "ojasbackend.firebasestorage.app",
  messagingSenderId: "86561541611",
  appId: "1:86561541611:web:5dfc5213ce5ae80d9bddae",
  measurementId: "G-Q388YK9S5E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, db, storage };