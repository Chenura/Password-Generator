const passwordEl = document.getElementById("password");
const lengthEl = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

const strengthEl = document.getElementById("strength");
const historyEl = document.getElementById("history");

// Load history
let history = JSON.parse(localStorage.getItem("pwHistory")) || [];

lengthEl.addEventListener("input", () => {
  lengthValue.innerText = lengthEl.value;
});

// 🔐 Secure password generator
function generatePassword() {
  let chars = "";
  if (uppercaseEl.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercaseEl.checked) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbersEl.checked) chars += "0123456789";
  if (symbolsEl.checked) chars += "!@#$%^&*()_+";

  if (!chars) return alert("Select at least one option!");

  let array = new Uint32Array(lengthEl.value);
  window.crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < lengthEl.value; i++) {
    password += chars[array[i] % chars.length];
  }

  passwordEl.value = password;

  updateStrength(password);

  history.unshift(password);
  history = history.slice(0, 15);
  localStorage.setItem("pwHistory", JSON.stringify(history));

  renderHistory();
}

// 📋 Copy
function copyPassword() {
  navigator.clipboard.writeText(passwordEl.value);
}

// 📊 Strength
function updateStrength(pw) {
  let score = 0;

  if (pw.length > 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*]/.test(pw)) score++;

  const levels = ["Weak", "Medium", "Strong", "Very Strong"];
  strengthEl.innerText = "Strength: " + levels[score - 1] || "Weak";
}

// 📜 History UI
function renderHistory() {
  historyEl.innerHTML = "";
  history.forEach(pw => {
    const li = document.createElement("li");
    li.innerText = pw;
    historyEl.appendChild(li);
  });
}

// 📁 Download
function downloadPasswords() {
  const blob = new Blob([history.join("\n")], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "passwords.txt";
  a.click();
}

// 🎤 Voice
function startVoice() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Voice not supported");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript.toLowerCase();

    if (text.includes("generate password")) {
      generatePassword();
    } else {
      alert("Say: generate password");
    }
  };

  recognition.start();
}

// Init
renderHistory();
