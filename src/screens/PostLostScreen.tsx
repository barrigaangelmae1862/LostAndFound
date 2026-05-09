import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { sendNotification } from "../services/notifications";
import { saveDraft } from "../services/offlineSync";
import { createPost } from "../services/posts";

export default function PostLostScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async () => {
  const data = {
    title,
    description,
    location,
    type: "lost",
  };

  try {
    // 🔥 SAVE TO FIREBASE
    await createPost(data);

    // 🔔 NOTIFICATION (demo feature)
    await sendNotification(
      "Lost Item Posted",
      "Your item is now visible to others"
    );

    Alert.alert("Success", "Posted successfully!");

    setTitle("");
    setDescription("");
    setLocation("");

  } catch (error) {
    console.log("Offline fallback");

    await saveDraft(data);

    Alert.alert("Offline Mode", "Saved locally. Will sync later.");
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Post Lost Item</Text>

      <TextInput
        style={styles.input}
        placeholder="Item Title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Location Lost"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "#ff6b00",
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
});