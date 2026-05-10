import React, { useEffect, useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { db } from "../services/firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { auth } from "../services/firebase";

const ADMIN_ID = "admin123";

const getChatId = (uid1: string, uid2: string) => {
  return uid1 > uid2 ? `${uid1}_${uid2}` : `${uid2}_${uid1}`;
};

export default function MessagesScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const userId = auth.currentUser?.uid;
  const chatId = getChatId(userId || "", ADMIN_ID);

  useEffect(() => {
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return unsub;
  }, []);

  const sendMessage = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: userId,
      receiverId: ADMIN_ID,
      createdAt: serverTimestamp(),
    });

    await sendNotification(text);
    setText("");
  };

  const sendNotification = async (message: string) => {
    try {
      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "ADMIN_EXPO_PUSH_TOKEN",
          sound: "default",
          title: "New Message 💬",
          body: message,
        }),
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Private Chat 💬</Text>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msg,
              item.senderId === userId ? styles.me : styles.them,
            ]}
          >
            <Text>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.row}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Message admin..."
          style={styles.input}
        />

        <TouchableOpacity onPress={sendMessage} style={styles.btn}>
          <Text style={{ color: "#fff" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  title: { fontSize: 20, fontWeight: "bold" },

  msg: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },

  me: {
    backgroundColor: "#ff6b00",
    alignSelf: "flex-end",
  },

  them: {
    backgroundColor: "#ddd",
    alignSelf: "flex-start",
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },

  btn: {
    backgroundColor: "#ff6b00",
    padding: 10,
    marginLeft: 5,
    borderRadius: 8,
  },
});