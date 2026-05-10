import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, Alert } from "react-native";
import {
  collection,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminDashboard() {
  const [posts, setPosts] = useState<any[]>([]);

  // 🔄 REAL-TIME PENDING POSTS
  useEffect(() => {
    const q = query(collection(db, "posts"), where("status", "==", "pending"));

    const unsub = onSnapshot(q, (snap) => {
      setPosts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return unsub;
  }, []);

  // 🔔 CREATE NOTIFICATION FUNCTION
  const sendNotification = async (post: any, message: string) => {
    try {
      await addDoc(collection(db, "notifications"), {
        userId: post.userId || "unknown",
        message,
        type: "system",
        read: false,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log("Notification error:", error);
    }
  };

  // ✅ APPROVE POST
  const approvePost = async (post: any) => {
    try {
      await updateDoc(doc(db, "posts", post.id), {
        status: "approved",
      });

      // 🔔 NOTIFY USER
      await sendNotification(
        post,
        `Your ${post.type} item "${post.title}" was approved ✔`
      );

      Alert.alert("Approved", "Post is now live ✔");

      checkMatch(post);
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to approve post");
    }
  };

  // ❌ REJECT POST
  const rejectPost = async (post: any) => {
    try {
      await updateDoc(doc(db, "posts", post.id), {
        status: "rejected",
      });

      // 🔔 NOTIFY USER
      await sendNotification(
        post,
        `Your ${post.type} item "${post.title}" was rejected ❌`
      );

      Alert.alert("Rejected", "Post has been rejected ❌");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to reject post");
    }
  };

  // 🔔 MATCH CHECK
  const checkMatch = async (currentPost: any) => {
    try {
      const allPostsSnap = await getDocs(collection(db, "posts"));

      let matchFound = false;

      allPostsSnap.forEach((docSnap) => {
        const data = docSnap.data();

        if (
          docSnap.id !== currentPost.id &&
          data.status === "approved" &&
          data.type !== currentPost.type &&
          data.category === currentPost.category
        ) {
          matchFound = true;
        }
      });

      if (matchFound) {
        Alert.alert(
          "MATCH FOUND 🔔",
          "A possible lost & found match has been detected!"
        );

        // 🔔 OPTIONAL GLOBAL NOTIFICATION
        await addDoc(collection(db, "notifications"), {
          userId: "all",
          message: `Possible match found for "${currentPost.title}"`,
          type: "match",
          read: false,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.log("Match error:", error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f2f2f2" }}>

      <Text style={{
        fontSize: 22,
        fontWeight: "bold",
        padding: 15
      }}>
        Admin Dashboard (Pending Posts)
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{
            backgroundColor: "#fff",
            margin: 10,
            padding: 15,
            borderRadius: 10,
            elevation: 3
          }}>

            {/* TITLE */}
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {item.title}
            </Text>

            {/* TYPE */}
            <Text style={{
              color: item.type === "lost" ? "red" : "green",
              fontWeight: "bold",
              marginBottom: 5
            }}>
              {item.type?.toUpperCase()}
            </Text>

            {/* DETAILS */}
            <Text>{item.description}</Text>
            <Text>📍 {item.location}</Text>
            <Text>📦 {item.category}</Text>

            {/* BUTTONS */}
            <View style={{
              flexDirection: "row",
              marginTop: 10,
              justifyContent: "space-between"
            }}>

              <View style={{ flex: 1, marginRight: 5 }}>
                <Button
                  title="Approve"
                  onPress={() => approvePost(item)}
                />
              </View>

              <View style={{ flex: 1, marginLeft: 5 }}>
                <Button
                  title="Reject"
                  color="red"
                  onPress={() => rejectPost(item)}
                />
              </View>

            </View>

          </View>
        )}
      />

    </View>
  );
}