const passwordEl = document.getElementById("password");
const lengthEl = document.getElementById("length");
const lengthValue = document.getElementById("lengthValue");

const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");

const strengthEl = document.getElementById("strength");
const historyEl = document.getElementById("history");

// 📜 Load history
let history = JSON.parse(localStorage.getItem("pwHistory")) || [];

// Slider update
lengthEl.addEventListener("input", () => {
  lengthValue.innerText = lengthEl.value;
});

// 🔐 Generate password (secure)
function generatePassword() {
  let chars = "";
  if (uppercaseEl.checked) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (lowercaseEl.checked) chars += "abcdefghijklmnopqrstuvwxyz";
  if (numbersEl.checked) chars += "0123456789";
  if (symbolsEl.checked) chars += "!@#$%^&*()_+";

  if (!chars) {
    alert("Select at least one option!");
    return;
  }

  const array = new Uint32Array(lengthEl.value);
  window.crypto.getRandomValues(array);

  let password = "";
  for (let i = 0; i < lengthEl.value; i++) {
    password += chars[array[i] % chars.length];
  }

  passwordEl.value = password;

  updateStrength(password);

  history.unshift(password);
  history = history.slice(0, 20);

  localStorage.setItem("pwHistory", JSON.stringify(history));
  renderHistory();
}

// 📋 Copy single password
function copyPassword() {
  navigator.clipboard.writeText(passwordEl.value);
  alert("Copied!");
}

// 📋 Copy all passwords
function copyAllPasswords() {
  navigator.clipboard.writeText(history.join("\n"));
  alert("All passwords copied!");
}

// 📊 Strength checker
function updateStrength(pw) {
  let score = 0;

  if (pw.length > 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*]/.test(pw)) score++;

  const levels = ["Weak", "Medium", "Strong", "Very Strong"];
  strengthEl.innerText = "Strength: " + (levels[score - 1] || "Weak");
}

// 📜 Render history
function renderHistory() {
  historyEl.innerHTML = "";

  history.forEach(pw => {
    const li = document.createElement("li");
    li.innerText = pw;
    historyEl.appendChild(li);
  });
}

// 📁 Download with FULL fallback (Android-safe)
function downloadPasswords() {
  const content = history.join("\n");

  try {
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords.txt";

    // 🔥 Android fix
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

  } catch (err) {
    fallbackDownload(content);
  }
}

// 🔁 Fallback method (works everywhere)
function fallbackDownload(content) {
  try {
    // Option 1: open in new tab
    const win = window.open();
    if (win) {
      win.document.write("<pre style='font-size:16px'>" + content + "</pre>");
      alert("Long press → Save or Copy");
    } else {
      throw new Error("Popup blocked");
    }
  } catch (e) {
    // Option 2: copy as last resort
    navigator.clipboard.writeText(content);
    alert("Download blocked. Content copied instead.");
  }
}

// 🎤 Voice command
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

// INIT
renderHistory();
