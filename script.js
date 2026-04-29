let currentPassword = "";

// Load history
let passwordHistory = JSON.parse(localStorage.getItem("passwordHistory")) || [];
renderHistory();

function generatePassword() {
    const length = document.getElementById("length").value;
    const upper = document.getElementById("upper").checked;
    const lower = document.getElementById("lower").checked;
    const numbers = document.getElementById("numbers").checked;
    const symbols = document.getElementById("symbols").checked;

    const upperSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowerSet = "abcdefghijklmnopqrstuvwxyz";
    const numberSet = "0123456789";
    const symbolSet = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (upper) chars += upperSet;
    if (lower) chars += lowerSet;
    if (numbers) chars += numberSet;
    if (symbols) chars += symbolSet;

    if (!chars) {
        alert("Select at least one option!");
        return;
    }

    let password = "";
    for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    currentPassword = password;
    document.getElementById("output").innerText = password;

    passwordHistory.unshift(password);
    if (passwordHistory.length > 20) passwordHistory.pop();

    localStorage.setItem("passwordHistory", JSON.stringify(passwordHistory));
    renderHistory();
}

function copyPassword() {
    if (!currentPassword) return;

    navigator.clipboard.writeText(currentPassword);
    alert("Copied to clipboard!");
}

// ✅ Android-safe download fix
function downloadPasswords() {
    if (passwordHistory.length === 0) {
        alert("No passwords to download!");
        return;
    }

    const text = passwordHistory.join("\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "passwords.txt";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Clear history
function clearHistory() {
    passwordHistory = [];
    localStorage.removeItem("passwordHistory");
    renderHistory();
    alert("History cleared!");
}

// Render history
function renderHistory() {
    const list = document.getElementById("history");
    list.innerHTML = "";

    passwordHistory.forEach(pw => {
        const li = document.createElement("li");
        li.textContent = pw;
        list.appendChild(li);
    });
}
