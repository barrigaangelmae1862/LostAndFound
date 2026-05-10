import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebase";

// Helper: convert uri → blob safely
const uriToBlob = async (uri: string) => {
  const response = await fetch(uri);
  return await response.blob();
};

export async function uploadImage() {
  try {
    // Ask permission first
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission denied to access gallery");
      return null;
    }

    // Pick image
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (result.canceled) return null;

    const uri = result.assets[0].uri;

    // Convert image to blob
    const blob = await uriToBlob(uri);

    // Create file name
    const filename = `posts/${Date.now()}.jpg`;

    // Upload reference
    const storageRef = ref(storage, filename);

    // Upload image
    await uploadBytes(storageRef, blob);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error) {
    console.log("Upload error:", error);
    return null;
  }
}