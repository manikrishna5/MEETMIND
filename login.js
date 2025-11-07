// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      alert("Login Successful ✅");
      console.log("Logged in user:", user);

      // Redirect to home page
      window.location.href = "home.html";
    } catch (error) {
      console.error("Error:", error);
      alert(error.message); // e.g., "Firebase: Error (auth/wrong-password)."
    }
  });
});
