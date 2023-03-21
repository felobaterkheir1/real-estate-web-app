// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYs0gSgQ6WMskTYcaPvUl8Po5ZdF0axUU",
  authDomain: "house-marketplace-app-b162c.firebaseapp.com",
  projectId: "house-marketplace-app-b162c",
  storageBucket: "house-marketplace-app-b162c.appspot.com",
  messagingSenderId: "92620263276",
  appId: "1:92620263276:web:401b1c7e5d63ce94276d49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()

// const admin = require('firebase-admin');

// const serviceAccount = require('./house-marketplace-app-b162c-firebase-adminsdk-r7jlj-4f26daf1ca.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://firestore.googleapis.com/v1/projects/house-marketplace-app-b162c/databases/(default)/documents"
// });
