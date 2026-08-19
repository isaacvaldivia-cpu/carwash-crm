// ============================================
// FIREBASE CONFIG — carwash-crm
// ============================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBevSvWNUBHCZRgRrthlTicy2_Dap_US84",
  authDomain: "carwash-crm-cdf50.firebaseapp.com",
  databaseURL: "https://carwash-crm-cdf50-default-rtdb.firebaseio.com",
  projectId: "carwash-crm-cdf50",
  storageBucket: "carwash-crm-cdf50.firebasestorage.app",
  messagingSenderId: "219035211353",
  appId: "1:219035211353:web:4d1a5c11e0a6fd11a1c348"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth, doc, getDoc, setDoc, signInWithEmailAndPassword, signOut, onAuthStateChanged };
