import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Image } from "react-native";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../services/firebase";
import { uploadImage } from "../services/uploadImage";

export default function PostItem({ navigation }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState<"lost" | "found">("lost");

  const [image, setImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  // 📸 IMAGE UPLOAD (OPTIONAL)
  const handleImageUpload = async () => {
    try {
      setUploading(true);

      const url = await uploadImage();

      if (url) {
        setImage(url);
        Alert.alert("Success", "Image uploaded successfully");
      }
    } catch (error) {
      console.log("Upload error:", error);
      Alert.alert("Error", "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  // 📤 POST SUBMIT
  const handlePost = async () => {
    if (!title || !description || !location || !category) {
      Alert.alert("Missing Fields", "Please fill all required fields");
      return;
    }

    try {
      setPosting(true);

      await addDoc(collection(db, "posts"), {
        title: title.trim(),
        description: description.trim(),
        location: location.trim(),
        category: category.trim(),
        type,

        // 📸 IMAGE IS OPTIONAL (IMPORTANT)
        imageUrl: image ? image : null,

        // 🔥 ADMIN SYSTEM
        status: "pending",

        createdAt: serverTimestamp(),
      });

      Alert.alert("Posted", "Waiting for admin approval");

      // reset form
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setImage(null);
      setType("lost");

      navigation.goBack();
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to post item");
    } finally {
      setPosting(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#f2f2f2" }}>

      {/* HEADER */}
      <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
        Create Post
      </Text>

      {/* LOST / FOUND BUTTONS */}
      <View style={{ flexDirection: "row", marginBottom: 15 }}>

        <TouchableOpacity
          onPress={() => setType("lost")}
          style={{
            flex: 1,
            padding: 12,
            marginRight: 5,
            borderRadius: 10,
            backgroundColor: type === "lost" ? "#ff4d4d" : "#ddd",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Lost</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setType("found")}
          style={{
            flex: 1,
            padding: 12,
            marginLeft: 5,
            borderRadius: 10,
            backgroundColor: type === "found" ? "#4CAF50" : "#ddd",
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>Found</Text>
        </TouchableOpacity>

      </View>

      {/* INPUTS */}
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={inputStyle} />
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} style={inputStyle} multiline />
      <TextInput placeholder="Location" value={location} onChangeText={setLocation} style={inputStyle} />
      <TextInput placeholder="Category" value={category} onChangeText={setCategory} style={inputStyle} />

      {/* IMAGE UPLOAD (OPTIONAL) */}
      <Text style={{ marginTop: 10, fontWeight: "bold" }}>
        Upload Image (Optional)
      </Text>

      <TouchableOpacity
        onPress={handleImageUpload}
        disabled={uploading}
        style={{
          backgroundColor: uploading ? "#888" : "#444",
          padding: 12,
          borderRadius: 10,
          marginTop: 8,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {uploading
            ? "Uploading..."
            : type === "lost"
            ? "Upload Image (Optional for Lost)"
            : "Upload Image (Optional for Found)"}
        </Text>
      </TouchableOpacity>

      {/* IMAGE PREVIEW */}
      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: "100%",
            height: 200,
            marginTop: 10,
            borderRadius: 10
          }}
        />
      )}

      {/* SUBMIT */}
      <TouchableOpacity
        onPress={handlePost}
        disabled={posting}
        style={{
          backgroundColor: posting ? "#666" : "#000",
          padding: 15,
          borderRadius: 10,
          marginTop: 20,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          {posting ? "Posting..." : "Submit Post"}
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const inputStyle = {
  backgroundColor: "#fff",
  padding: 12,
  borderRadius: 10,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: "#ddd",
};