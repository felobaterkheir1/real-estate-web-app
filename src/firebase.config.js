// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: apiKey,
  authDomain: "house-marketplace-app-b162c.firebaseapp.com",
  projectId: "house-marketplace-app-b162c",
  storageBucket: "house-marketplace-app-b162c.appspot.com",
  messagingSenderId: "92620263276",
  appId: "1:92620263276:web:401b1c7e5d63ce94276d49"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore()

