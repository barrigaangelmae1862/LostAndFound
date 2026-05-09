import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANhpvGCrelqHghX7bG9U_QUkqJOBRPUtY",
  authDomain: "lostfound-app-81f5b.firebaseapp.com",
  projectId: "lostfound-app-81f5b",
  storageBucket: "lostfound-app-81f5b.firebasestorage.app",
  messagingSenderId: "275770830551",
  appId: "1:275770830551:web:b35487e5c6c0f734b6ca92"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);