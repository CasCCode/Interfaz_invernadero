import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAFiXyrJpmzFl9Liyb3dIWnICPS1LeRax0",
  authDomain: "growsphere-dee6d.firebaseapp.com",
  projectId: "growsphere-dee6d",
  storageBucket: "growsphere-dee6d.firebasestorage.app", 
  messagingSenderId: "987338714963",
  appId: "1:987338714963:web:9f55c9ce0347fa891e7ba6"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);