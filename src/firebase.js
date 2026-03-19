// src/firebase.js

import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyC6-RtO6zU4MXl-EbqzEo3DJz7-_jU0zVQ",
  authDomain: "omnishop-66d18.firebaseapp.com",
  projectId: "omnishop-66d18",
  messagingSenderId: "33212048795",
  appId: "1:33212048795:web:ae42691c53e188fadded3e",
  storageBucket: "omnishop-66d18.firebasestorage.app"
 
};

const app = initializeApp(firebaseConfig);

export const messaging = getMessaging(app);
