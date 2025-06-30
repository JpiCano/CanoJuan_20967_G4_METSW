import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🔴 Reemplaza estos datos con los de tu consola Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCfw-kWGpY9QWqdDA5wo4IoqZDG-kNQ1mE",
  authDomain: "sol-luxur-dream.firebaseapp.com",
  projectId: "sol-luxur-dream",
  storageBucket: "sol-luxur-dream.appspot.com", // ← corregido aquí
  messagingSenderId: "896376827316",
  appId: "1:896376827316:web:05be201e88ef6cd964d6e1",
  measurementId: "G-KFMGVSJ13T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
