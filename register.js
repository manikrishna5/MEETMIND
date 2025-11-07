// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDKlXFlTxgJzkFdzA6XUqGh_eYickyPVjw",
  authDomain: "meetmind-e4031.firebaseapp.com",
  projectId: "meetmind-e4031",
  storageBucket: "meetmind-e4031.appspot.com",
  messagingSenderId: "933032705013",
  appId: "1:933032705013:web:cd30d85ae362dbdf097ebc",
  measurementId: "G-170NY1CC0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Add form listener
document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("registerForm");

  registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    const confirmPassword = document.getElementById("registerConfirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          createdAt: new Date()
        });
      alert("Account created successfully ✅");
      console.log("User registered:", user);
      showForm('login');
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    }
  });
});
