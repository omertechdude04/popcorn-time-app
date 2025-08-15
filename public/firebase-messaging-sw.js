// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDLhPoJ8L5K4mrsOQ2dlpX8NECdwvqRL8w",
  authDomain: "movie-reminder-app-d21e3.firebaseapp.com",
  projectId: "movie-reminder-app-d21e3",
  storageBucket: "movie-reminder-app-d21e3.appspot.com",
  messagingSenderId: "39464004653",
  appId: "1:39464004653:web:f0c28d20f9fd0c614d9ca4",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});

Notification.requestPermission().then(permission => {
  if (permission === 'granted') {
    console.log('Notifications allowed!');
  }
});
