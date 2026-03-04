import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";
import axios from "axios";

export const setupNotifications = async () => {
  console.log("call");
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return;

    const token = await getToken(messaging, {
      vapidKey: "BDUicFN8otrvLZgiovPdABJlG9CtbBqjDOxbka3BXnN8X2cHTPx1Sj0Xir2R9X3Hz_U4iO_RZrC68EPi-TxZkW4"
    });

    if (token) {
      console.log("FCM Token:", token);

      await axios.post(
        "http://localhost:8080/user/save-token",
        { token },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        }
      );
      await axios.post(
    "http://localhost:8080/user/subscribe", 
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