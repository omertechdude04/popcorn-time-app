// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDLhPoJ8L5K4mrsOQ2dlpX8NECdwvqRL8w",
  authDomain: "movie-reminder-app-d21e3.firebaseapp.com",
  projectId: "movie-reminder-app-d21e3",
  storageBucket: "movie-reminder-app-d21e3.appspot.com",
  messagingSenderId: "39464004653",
  appId: "1:39464004653:web:f0c28d20f9fd0c614d9ca4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export const requestForToken = (setTokenFound) => {
  return getToken(messaging, { vapidKey: "YOUR_VAPID_KEY" })
    .then((currentToken) => {
      if (currentToken) {
        console.log("Current token:", currentToken);
        setTokenFound(true);
      } else {
        console.log("No registration token available");
        setTokenFound(false);
      }
    })
    .catch((err) => {
      console.log("An error occurred while retrieving token. ", err);
      setTokenFound(false);
    });
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
