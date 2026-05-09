import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { db } from "../services/firebase";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

export default function AdminDashboardScreen() {
  const [posts, setPosts] = useState<any[]>([]);

  // 🔄 LOAD POSTS
  const fetchPosts = async () => {
    const snapshot = await getDocs(collection(db, "posts"));

    const data: any[] = [];
    snapshot.forEach((docItem) => {
      data.push({ id: docItem.id, ...docItem.data() });
    });

    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // ✅ APPROVE POST
  const approvePost = async (item: any) => {
    try {
      await addDoc(collection(db, "approvedPosts"), item);
      await deleteDoc(doc(db, "posts", item.id));

      Alert.alert("Approved", "Post approved successfully!");
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  // ❌ REJECT POST
  const rejectPost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "posts", id));
      Alert.alert("Rejected", "Post removed!");
      fetchPosts();
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>{item.description}</Text>
      <Text style={styles.location}>📍 {item.location}</Text>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.approve}
          onPress={() => approvePost(item)}
        >
          <Text style={styles.btnText}>Approve</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.reject}
          onPress={() => rejectPost(item.id)}
        >
          <Text style={styles.btnText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },

  card: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 10,
  },

  title: { fontSize: 18, fontWeight: "bold" },
  location: { marginTop: 5, color: "gray" },

  buttons: {
    flexDirection: "row",
    marginTop: 10,
    gap: 10,
  },

  approve: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 6,
  },

  reject: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 6,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
});