import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyANhpvGCrelqHghX7bG9U_QUkqJOBRPUtY",
  authDomain: "lostfound-app-81f5b.firebaseapp.com",
  projectId: "lostfound-app-81f5b",
  storageBucket: "lostfound-app-81f5b.appspot.com",
  messagingSenderId: "275770830551",
  appId: "1:275770830551:web:b35487e5c6c0f734b6ca92"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);