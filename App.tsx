import React, { useEffect } from "react";
import AppNavigator from "./src/navigation/AppNavigator";
import * as Notifications from "expo-notifications";

import { registerForPushToken } from "./src/services/pushToken";
import { db } from "./src/services/firebase";
import { doc, setDoc } from "firebase/firestore";

import { auth } from "./src/services/firebase";

export default function App() {

  useEffect(() => {
    setupNotifications();
  }, []);

  const setupNotifications = async () => {
    try {

      // 🔔 Ask permission
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== "granted") {
        console.log("Permission denied");
        return;
      }

      // 🔑 Get push token
      const token = await registerForPushToken();
      console.log("🔥 Push Token:", token);

      // 👤 Get REAL logged-in user
      const user = auth.currentUser;

      if (!user) {
        console.log("No logged-in user yet");
        return;
      }

      // 💾 Save token per USER (IMPORTANT FIX)
      await setDoc(
        doc(db, "users", user.uid),
        {
          expoPushToken: token,
        },
        { merge: true }
      );

      console.log("Token saved for:", user.uid);

    } catch (error) {
      console.log("Setup error:", error);
    }
  };

  return <AppNavigator />;
}