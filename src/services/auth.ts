import { auth, db } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "firebase/auth";

import { doc, setDoc, getDoc } from "firebase/firestore";

// 🔥 REGISTER (NOW WITH ROLE + PROFILE)
export const registerUser = async (
  email: string,
  password: string,
  extraData: any = {}
) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);

  const user = userCredential.user;

  // save user profile in Firestore
  await setDoc(doc(db, "users", user.uid), {
    email,
    role: extraData.role || "user",
    yearLevel: extraData.yearLevel || "",
    program: extraData.program || "",
    createdAt: new Date()
  });

  return userCredential;
};

// 🔑 LOGIN
export const loginUser = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 🚪 LOGOUT
export const logoutUser = () => {
  return signOut(auth);
};

// 🧠 GET ROLE (IMPORTANT FOR ADMIN SYSTEM)
export const getUserRole = async (uid: string) => {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data().role;
  }

  return "user";
};