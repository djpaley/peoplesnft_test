// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBqwei2ru5zROSXgVWQmo18kzJyNdwPnRI",
  authDomain: "peoplesnft-da383.firebaseapp.com",
  projectId: "peoplesnft-da383",
  storageBucket: "peoplesnft-da383.appspot.com",
  messagingSenderId: "800085454889",
  appId: "1:800085454889:web:7eb07191fb0156e5242c38",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default getFirestore(app);
