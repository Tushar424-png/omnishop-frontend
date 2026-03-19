import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";

export const setupNotifications = async () => {
  const BASE_URL = process.env.REACT_APP_API_URL;
  console.log("call");
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: process.env.REACT_APP_VAPID_KEY
    });

    if (token) {
      console.log("FCM Token:", token);

      await axios.post(
        `${BASE_URL}/user/save-token`,
        { token },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      await axios.post(
    `${BASE_URL}/user/subscribe`, 
    { token },
    { headers: { Authorization: "Bearer " + localStorage.getItem("token") } }
  );

      console.log("Token saved successfully");
    }

  } catch (err) {
    console.log("Notification error:", err);
  }
};

export const listenForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    alert(
      payload.notification.title + "\n" +
      payload.notification.body
    );
  });
};