import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWT54UvCmn4Nl99fx1BMrtfUjjMhNM4UA",
  authDomain: "tetrismp-e1e66.firebaseapp.com",
  projectId: "tetrismp-e1e66",
  storageBucket: "tetrismp-e1e66.firebasestorage.app",
  messagingSenderId: "532138962557",
  appId: "1:532138962557:web:b26361e1563f46ed23cb14",
  measurementId: "G-3H3JPBQR5Z"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);