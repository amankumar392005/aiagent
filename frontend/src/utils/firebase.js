
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "aiagent-6144f.firebaseapp.com",
  projectId: "aiagent-6144f",
  storageBucket: "aiagent-6144f.firebasestorage.app",
  messagingSenderId: "216724983118",
  appId: "1:216724983118:web:e8b10987fa230b0e1ee21f",
};


const app = initializeApp(firebaseConfig);

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

export {auth , provider}