import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "draft_post";

export async function saveDraft(data: any) {
  await AsyncStorage.setItem(KEY, JSON.stringify(data));
}