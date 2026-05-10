import React from "react";
import { View, Text } from "react-native";

export default function NotificationBadge({ count }: { count: number }) {
  if (count === 0) return null;

  return (
    <View style={{
      backgroundColor: "red",
      borderRadius: 10,
      padding: 5,
      position: "absolute",
      top: -5,
      right: -5,
    }}>
      <Text style={{ color: "white", fontSize: 12 }}>
        {count}
      </Text>
    </View>
  );
}