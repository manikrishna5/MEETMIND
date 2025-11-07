//const profileIcon = document.querySelector('.profile-icon');
//const profileModal = document.getElementById('profileModal');
const mainCards = document.getElementById('mainCards'); //
const studentSection = document.getElementById('studentSection'); //
const summaryBox = document.getElementById('summaryBox');
const summaryText = document.getElementById('summaryText');
const actionButtons = document.getElementById('actionButtons');
const quizSection = document.getElementById('quizSection');
const taskSection = document.getElementById('taskSection');
const reminderSection = document.getElementById('reminderSection');


import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDKlXFlTxgJzkFdzA6XUqGh_eYickyPVjw",
  authDomain: "meetmind-e4031.firebaseapp.com",
  projectId: "meetmind-e4031",
  storageBucket: "meetmind-e4031.appspot.com",
  messagingSenderId: "933032705013",
  appId: "1:933032705013:web:cd30d85ae362dbdf097ebc",
  measurementId: "G-170NY1CC0E"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");
const profileIcon = document.getElementById("profileIcon");
const profileDropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");
const welcome = document.getElementById("welcome");

window.checkAnswer = checkAnswer;
window.replayQuiz = replayQuiz;
window.showQuestion = showQuestion;
window.showResults = showResults;


// Toggle dropdown
profileIcon.addEventListener("click", () => {
  profileDropdown.style.display = profileDropdown.style.display === "flex" ? "none" : "flex";
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  window.location.href = "index.html";
});

// Fetch user data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      profileName.textContent = data.name;
      profileEmail.textContent = data.email;
      welcome.textContent = "Welcome "+data.name;
    }
  } else {
    window.location.href = "index.html"; // redirect if not logged in
  }
});


document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btnStudent").addEventListener("click", () => showAlert('Student'));
  document.getElementById("btnCorporate").addEventListener("click", () => showAlert('Corporate'));
  document.getElementById("btnProject").addEventListener("click", () => showAlert('Project'));
});


function showAlert(section) {
    if (section === 'Student') {
        mainCards.style.display = 'none';
        studentSection.classList.add('active');
    } else if(section=='Corporate') {
        window.location.href = 'corporate.html';
    } else{
        window.location.href = 'projectmanage.html';
    }
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("uploadBtn").addEventListener("click", submitFile);
});

let extractedSummary = "";
let extractedTasks = "";

async function submitFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file first!");
        return;
    }

    hideAllSections(); // hide quiz, task, reminders first
    actionButtons.classList.remove('active');

    summaryText.innerHTML = "⏳ Processing your file...";
    summaryBox.classList.add('active');

    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append('content_type', contentType);

        const response = await fetch("http://127.0.0.1:5000/api/summarize", {
            method: "POST",
            body: formData
        });

        if (!response.ok) {
            throw new Error("Server error");
        }

        const data = await response.json();
        let summaryTextFormatted = data.summary?.trim() || "";

        if (!summaryTextFormatted) {
            summaryText.innerHTML = "<b>Something went wrong:</b> No summary text received.";
            return;
        }
                // Detect if headings exist (case-insensitive)
        const hasSummary = summaryTextFormatted.toLowerCase().includes("summary");
        const hasTasks = summaryTextFormatted.toLowerCase().includes("tasks");

        // Add formatting only if headings exist
        if (hasSummary) {
            summaryTextFormatted = summaryTextFormatted.replace(/Summary[:-]*/i, "<b>Summary:</b>");
        }
        if (hasTasks) {
            summaryTextFormatted = summaryTextFormatted.replace(/Tasks to be done - by mindmeet/i, "<br><br><b>Tasks to be done - by mindmeet</b>");
        }

        // Fallback if neither heading present
        if (!hasSummary && !hasTasks) {
            summaryTextFormatted = "<b>Summary:</b><br>" + summaryTextFormatted;
        }

        // Convert newlines to <br>
        summaryTextFormatted = summaryTextFormatted.replace(/\n/g, "<br>");

        const parts = summaryTextFormatted.split(/Tasks to be done - by mindmeet/i);
        extractedSummary = parts[0]
            ?.replace(/<[^>]*>/g, '') // remove HTML tags
            .replace(/Summary[:-]*/i, '')
            .trim() || "";
        extractedTasks = parts[1]
            ?.replace(/<[^>]*>/g, '')
            .trim() || "";

        summaryText.innerHTML = summaryTextFormatted;
         console.log("🟢 Extracted Summary:", extractedSummary);
        console.log("🟡 Extracted Tasks:", extractedTasks);
        showActionButtons(); // Show quiz, tasks, reminders buttons
    } catch (error) {
        console.error(error);
        summaryText.innerHTML = "❌ Something went wrong while processing your file.";
    }
}
// 📨 Send the tasks and email to n8n webhook
async function sendTasksToWebhook(email, tasks) {
  try {
    const response = await fetch("https://kukkadapu-rajesh.app.n8n.cloud/webhook/send-task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, tasks })
    });
    console.log("✅ Sent to n8n webhook:", await response.text());
  } catch (err) {
    console.error("❌ Error sending to n8n webhook:", err);
  }
}

window.showQuiz = showQuiz;
window.showTaskSchedule = showTaskSchedule;
window.showReminders = showReminders;
window.backToSummary = backToSummary;


// 🎉 Confetti helper
function triggerConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#bb0000', '#ffffff', '#00bb00', '#0077ff'];

    (function frame() {
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    })();
}
let globalQuizData = [];
let currentQuestionIndex = 0;
let score = 0;

function updateScoreBoard() {
    document.getElementById("currentScore").textContent = score;
}

// 🧠 Generate Quiz dynamically
async function generateQuiz(summaryText) {
    const quizSection = document.getElementById("quizSection");
    quizSection.innerHTML = `<h3>🧠 Generating your quiz...</h3>`;

    try {
        const response = await fetch("http://127.0.0.1:5000/generate_quiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ summary: summaryText })
        });

        const data = await response.json();
        globalQuizData = data.quiz || [];
        currentQuestionIndex = 0;
        score = 0;

        if (globalQuizData.length === 0) {
            quizSection.innerHTML = `<p>No quiz questions could be generated.</p>`;
            return;
        }

        showQuestion();

    } catch (error) {
        console.error("Error generating quiz:", error);
        quizSection.innerHTML = `<p>⚠️ Failed to generate quiz.</p>`;
    }
}
function showQuestion() {
    const quizSection = document.getElementById("quizSection");
    quizSection.innerHTML = `<h3>Quiz</h3>`;

    const question = globalQuizData[currentQuestionIndex];
    if (!question) {
        showResults();
        return;
    }

    const questionHTML = `
        <div class="quiz-card">
            <h4>Q${currentQuestionIndex + 1}. ${question.question}</h4>
            ${question.options.map((opt, i) => `
                <button class="option-btn" onclick="checkAnswer(${i})">${opt}</button>
            `).join('')}
        </div>
        <p class="quiz-progress">Question ${currentQuestionIndex + 1} of ${globalQuizData.length}</p>
    `;

    quizSection.innerHTML += questionHTML;
}
function checkAnswer(selectedIndex) {
    const question = globalQuizData[currentQuestionIndex];
    const quizSection = document.getElementById("quizSection");
    const correctIndex = question.options.indexOf(question.answer);

    const buttons = quizSection.querySelectorAll(".option-btn");
    buttons.forEach((btn, i) => {
        if (i === correctIndex) btn.classList.add("correct");
        if (i === selectedIndex && i !== correctIndex) btn.classList.add("wrong");
        btn.disabled = true;
    });

    if (selectedIndex === correctIndex) {
        score += 10;
    } else {
        score -= 5;
    }

    updateScoreBoard();  // ✅ refresh scoreboard live

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 1000);
}

function showResults() {
    const quizSection = document.getElementById("quizSection");
    quizSection.innerHTML = `
        <h3>Quiz Complete!</h3>
        <p>Your Score: <strong>${score}</strong> / ${globalQuizData.length * 10}</p>
        <button onclick="replayQuiz()">🔁 Try Again</button>
    `;

    if (score >= 80) {
        // Confetti celebration
        const duration = 2 * 1000;
        const end = Date.now() + duration;

        const colors = ['#00FF88', '#FFD700', '#FF69B4'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) requestAnimationFrame(frame);
        }());
    }
}

function replayQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    showQuestion();
}


// 📘 Show Quiz Section
function showQuiz() {
    hideAllSections(true);
    quizSection.classList.add('active');
    generateQuiz(extractedSummary);
}




function showActionButtons() {
    document.querySelectorAll('.action-btn').forEach(btn => {
        btn.classList.add('active');
    });
}





function showTaskSchedule() {
  hideAllSections(true);
  taskSection.classList.add("active");

  // Clear existing content
  taskSection.innerHTML = `
    <h3>📁 Tasks to be Done</h3>
    <div id="tasksDisplay" class="task-text">${extractedTasks || "No tasks found."}</div>
  `;

  // --- Create Send Tasks to Email button ---
  const sendButton = document.createElement("button");
  sendButton.textContent = "Send Tasks to Email";
  sendButton.classList.add("action-btn", "active"); // matches your blue button styling

  // Button click handler
  sendButton.onclick = async () => {
    const email = document.getElementById("profileEmail")?.textContent?.trim();
    const tasks = extractedTasks?.trim();

    if (!email) {
      alert("⚠️ User email not found. Please make sure you are logged in.");
      return;
    }

    if (!tasks) {
      alert("⚠️ No tasks available to send.");
      return;
    }

    alert("📨 Sending tasks to " + email + " ...");

    try {
      const response = await fetch("https://kukkadapu-rajesh.app.n8n.cloud/webhook/send-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, tasks })
      });

      if (response.ok) {
        alert("✅ Tasks sent successfully!");
      } else {
        alert("❌ Failed to send tasks. Check your n8n webhook URL.");
      }
    } catch (err) {
      console.error("Error sending tasks:", err);
      alert("⚠️ Something went wrong while sending the email.");
    }
  };

  // Append button below tasks
  taskSection.appendChild(sendButton);
}



function showReminders() {
    hideAllSections(true);
    reminderSection.classList.add('active');
}

function backToSummary() {
    hideAllSections(true);
    summaryBox.classList.add('active');
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("backBtn").addEventListener("click", submitFile);
});


function backToHome() {
    studentSection.classList.remove('active');
    mainCards.style.display = 'grid';
    document.querySelector('.upload-section').style.display = 'block';
    summaryBox.classList.remove('active');
    hideAllSections(true);
    document.getElementById('fileInput').value = '';
}

function hideAllSections(excludeSummary = false) {
    quizSection.classList.remove('active');
    taskSection.classList.remove('active');
    reminderSection.classList.remove('active');
    if (!excludeSummary) summaryBox.classList.remove('active');
}
