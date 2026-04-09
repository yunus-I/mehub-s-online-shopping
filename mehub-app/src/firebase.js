import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCVkcPaADrNOSPWTUePORhM3W_LGCV1Nwc",
  authDomain: "mehub-15458.firebaseapp.com",
  projectId: "mehub-15458",
  storageBucket: "mehub-15458.firebasestorage.app",
  messagingSenderId: "346435592786",
  appId: "1:346435592786:web:d95d0f404fc2a50298f58b"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
