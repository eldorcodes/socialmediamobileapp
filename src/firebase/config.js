// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDLw4EcLzHm_la6GBfwZxmey40-D-Qn1g8",
  authDomain: "quick-chat-aee54.firebaseapp.com",
  databaseURL: "https://quick-chat-aee54-default-rtdb.firebaseio.com",
  projectId: "quick-chat-aee54",
  storageBucket: "quick-chat-aee54.appspot.com",
  messagingSenderId: "248680263258",
  appId: "1:248680263258:web:3ddec813b34d5dc32f7263",
  measurementId: "G-7VMPEB59WT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;