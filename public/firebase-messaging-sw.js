importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyC6-RtO6zU4MXl-EbqzEo3DJz7-_jU0zVQ",
  authDomain: "omnishop-66d18.firebaseapp.com",
  projectId: "omnishop-66d18",
  messagingSenderId: "33212048795",
  appId: "1:33212048795:web:ae42691c53e188fadded3e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
