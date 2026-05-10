import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../services/firebase";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "posts"),
      where("status", "==", "approved")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // 🧠 SAFE SORT (prevents crash)
        data.sort((a: any, b: any) => {
          const timeA = a.createdAt?.seconds || 0;
          const timeB = b.createdAt?.seconds || 0;
          return timeB - timeA;
        });

        setPosts(data);
        setLoading(false);
      },
      (error) => {
        console.log("Feed error:", error);
        setLoading(false);
      }
    );

    return unsub;
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading feed...</Text>
      </View>
    );
  }

  if (posts.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 16 }}>No approved posts yet 📭</Text>
        <Text style={{ color: "gray" }}>Check back later</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 10 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#fff",
            marginBottom: 12,
            padding: 15,
            borderRadius: 12,
            elevation: 3,
          }}
        >
          {/* TITLE */}
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>
            {item.title || "No Title"}
          </Text>

          {/* TYPE */}
          <Text
            style={{
              color: item.type === "lost" ? "red" : "green",
              fontWeight: "bold",
              marginVertical: 5,
            }}
          >
            {(item.type || "UNKNOWN").toUpperCase()}
          </Text>

          {/* DESCRIPTION */}
          <Text>{item.description || "No description"}</Text>

          {/* DETAILS */}
          <Text>📍 {item.location || "No location"}</Text>
          <Text>📦 {item.category || "No category"}</Text>

          {/* IMAGE (SAFE) */}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={{
                width: "100%",
                height: 220,
                marginTop: 10,
                borderRadius: 10,
              }}
            />
          ) : (
            <Text style={{ marginTop: 10, color: "gray" }}>
              No image uploaded
            </Text>
          )}
        </View>
      )}
    />
  );
}