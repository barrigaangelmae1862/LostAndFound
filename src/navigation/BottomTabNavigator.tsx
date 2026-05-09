import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import HomeScreen from "../screens/HomeScreen";
import PostLostScreen from "../screens/PostLostScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Post" component={PostLostScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Admin" component={AdminDashboardScreen} />
    </Tab.Navigator>
  );
}