import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function createPost(data: any) {
  return await addDoc(collection(db, "posts"), {
    ...data,
    createdAt: serverTimestamp(),
  });
}