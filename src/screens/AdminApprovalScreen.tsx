import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  query,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/firebase";

export default function AdminApprovalScreen() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "pending")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(data);
    });

    return unsub;
  }, []);

  // 🔔 PUSH NOTIFICATION FUNCTION
  const sendPushNotification = async (
    expoPushToken: string,
    title: string,
    body: string
  ) => {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: expoPushToken,
          sound: "default",
          title,
          body,
        }),
      });
    } catch (error) {
      console.log("Push error:", error);
    }
  };

  // 🛠️ APPROVE POST + NOTIFY USER
  const approvePost = async (post: any) => {
    try {
      // 1. update post status
      await updateDoc(doc(db, "posts", post.id), {
        status: "approved",
      });

      // 2. get user data
      const userRef = doc(db, "users", post.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        const token = userData?.expoPushToken;

        if (token) {
          await sendPushNotification(
            token,
            "🎉 Item Approved!",
            `Your post "${post.title}" is now visible in the feed.`
          );
        }
      }

      Alert.alert("Success", "Post approved & user notified");

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  // ❌ REJECT POST + NOTIFY USER
  const rejectPost = async (post: any) => {
    try {
      await updateDoc(doc(db, "posts", post.id), {
        status: "rejected",
      });

      const userRef = doc(db, "users", post.userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const token = userSnap.data()?.expoPushToken;

        if (token) {
          await sendPushNotification(
            token,
            "❌ Post Rejected",
            `Your post "${post.title}" was not approved.`
          );
        }
      }

      Alert.alert("Rejected", "User has been notified");

    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Pending Posts 🟡
      </Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No pending posts 🎉
          </Text>
        }
        renderItem={({ item }) => (
          <View
            style={{
              backgroundColor: "#fff",
              padding: 15,
              marginBottom: 10,
              borderRadius: 10,
              elevation: 3,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "bold" }}>
              {item.title}
            </Text>

            <Text>{item.description}</Text>
            <Text>📍 {item.location}</Text>
            <Text>📦 {item.category}</Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>

              <TouchableOpacity
                onPress={() => approvePost(item)}
                style={{
                  backgroundColor: "green",
                  padding: 10,
                  marginRight: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Approve</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => rejectPost(item)}
                style={{
                  backgroundColor: "red",
                  padding: 10,
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: "#fff" }}>Reject</Text>
              </TouchableOpacity>

            </View>
          </View>
        )}
      />
    </View>
  );
}