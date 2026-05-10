import * as Notifications from "expo-notifications";

export async function registerForPushToken() {
  const token = await Notifications.getExpoPushTokenAsync();
  return token.data;
}