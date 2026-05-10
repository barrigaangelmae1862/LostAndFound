import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

export default function NotificationsScreen() {
  // temporary sample data (we will replace with Firebase later)
  const notifications = [
    {
      id: "1",
      title: "Welcome 👋",
      message: "Your Lost & Found app is ready to use.",
    },
    {
      id: "2",
      title: "Tip 💡",
      message: "Always upload an image to increase item recovery chance.",
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications 🔔</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardText}>{item.message}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardText: {
    marginTop: 5,
    color: "gray",
  },
});