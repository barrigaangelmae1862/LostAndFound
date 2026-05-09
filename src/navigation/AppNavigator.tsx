import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";

import BottomTabNavigator from "./BottomTabNavigator";
import { auth } from "../services/firebase";

// Screens
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 🔐 Firebase auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>

        {user ? (
          // 🔥 LOGGED IN FLOW (APP)
          <>
            <Stack.Screen name="Main" component={BottomTabNavigator} />
          </>
        ) : (
          // 🔓 AUTH FLOW (LOGIN SYSTEM)
          <>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}