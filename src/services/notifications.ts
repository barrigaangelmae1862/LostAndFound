import * as Notifications from "expo-notifications";

export async function requestPermission() {
  await Notifications.requestPermissionsAsync();
}

export async function sendNotification(title: string, body: string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
    },
    trigger: null,
  });
}