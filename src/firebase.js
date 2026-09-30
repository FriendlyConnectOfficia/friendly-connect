import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB5DP6WHFavI1FWoEzHRV5v5-ikagyTl3c",
  authDomain:
    "friendly-connect-c40ef.firebaseapp.com",
  projectId: "friendly-connect-c40ef",
  storageBucket:
    "friendly-connect-c40ef.firebasestorage.app",
  messagingSenderId: "508112984905",
  appId:
    "1:508112984905:web:c1e51d11a144fcbc8f1898",
  measurementId: "G-1XZ4R5EHCC",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);