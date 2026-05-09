import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, RefreshControl } from "react-native";
import { db } from "../services/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

export default function HomeScreen() {
  const [posts, setPosts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // 🔥 REAL-TIME FIREBASE LISTENER
  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data: any[] = [];

      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });

      setPosts(data);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 manual refresh (optional)
  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>
      <Text style={styles.type}>{item.type?.toUpperCase()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lost & Found Feed</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  location: {
    marginTop: 5,
    color: "gray",
  },
  type: {
    marginTop: 5,
    fontWeight: "bold",
    color: "#ff6b00",
  },
});