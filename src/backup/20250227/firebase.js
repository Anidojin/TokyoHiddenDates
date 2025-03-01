// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCreLY1pZ858J7CLJ7tEWoXEatr1oiFfWk",
  authDomain: "tokyohiddendates.firebaseapp.com",
  projectId: "tokyohiddendates",
  storageBucket: "tokyohiddendates.firebasestorage.app",
  messagingSenderId: "578595606212",
  appId: "1:578595606212:web:7faf4a2da69a9a31918391",
  measurementId: "G-ER4FCTL3C2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);