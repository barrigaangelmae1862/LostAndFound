import React from "react";
import { Image, View, StyleSheet } from "react-native";

export default function FoxLogo() {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/icon.png")}
        style={styles.logo}
        resizeMode="contain"
        onError={() => console.log("Image failed to load")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 130,
    height: 130,
  },
});