import React, { useState } from "react";
import { View, Text, Button, Alert, ActivityIndicator } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

export default function SettingsScreen({ navigation }: any) {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut(auth);

      Alert.alert("Logged out", "You have been signed out.");

      // ⚠️ IMPORTANT: MUST MATCH YOUR LOGIN SCREEN NAME
      navigation.replace("Login");

    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: "center" }}>

      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Settings
      </Text>

      <Text style={{ marginBottom: 20, color: "gray" }}>
        Manage your account and app preferences
      </Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Button title="Logout" onPress={handleLogout} color="#ff6b00" />
      )}

    </View>
  );
}