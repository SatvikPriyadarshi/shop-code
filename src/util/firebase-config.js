// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCE6smekEHLZBqkv2mUmyrVMMrm9Ey3mgQ",
  authDomain: "shopcode-52a98.firebaseapp.com",
  projectId: "shopcode-52a98",
  storageBucket: "shopcode-52a98.appspot.com",
  messagingSenderId: "571508433093",
  appId: "1:571508433093:web:cd29cdc2f37c83f9dad0ac",
  measurementId: "G-L2B2LPN67Q"
};

// Initialize Firebase
const firebaseAppconfig = initializeApp(firebaseConfig);
 
export default firebaseAppconfig