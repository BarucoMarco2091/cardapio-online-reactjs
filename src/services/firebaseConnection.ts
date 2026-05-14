import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDFrWFlsJJ4ytfnJVPfKmRTdebn34998Ms",
  authDomain: "devburger-34f55.firebaseapp.com",
  projectId: "devburger-34f55",
  storageBucket: "devburger-34f55.firebasestorage.app",
  messagingSenderId: "465411636924",
  appId: "1:465411636924:web:13116dc3caea8196a5dab9"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export {db, auth, storage}