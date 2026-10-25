// ===== Select elements =====
const moodButtons = document.querySelectorAll(".mood-btn");
const note = document.querySelector("#note");
const saveButton = document.querySelector("#save");
const historyList = document.querySelector("#history");
const stats = document.querySelector("#stats");

let selectedMood = null;

// ===== Emojis by mood =====
const emojis = {
  happy: "😄",
  good: "🙂",
  neutral: "😐",
  sad: "😔",
  bad: "😢",
};

// ===== Pick a mood =====
moodButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    moodButtons.forEach((b) => b.classList.remove("selected"));
    button.classList.add("selected");
    selectedMood = button.dataset.mood;
  });
});

// ===== Save entry =====
saveButton.addEventListener("click", async function () {
  if (!selectedMood) {
    alert("Pick a mood first!");
    return;
  }

  const today = new Date().toISOString().split("T")[0];

  const newEntry = {
    date: today,
    mood: selectedMood,
    note: note.value.trim(),
  };

  try {
    const response = await fetch("/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEntry),
    });

    if (!response.ok) throw new Error("Error saving");

    note.value = "";
    selectedMood = null;
    moodButtons.forEach((b) => b.classList.remove("selected"));

    loadHistory();
    loadStats();
  } catch (error) {
    alert("Couldn't save the entry.");
  }
});

// ===== Load history =====
async function loadHistory() {
  const response = await fetch("/entries");
  const entries = await response.json();

  historyList.innerHTML = "";

  if (entries.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = "No entries yet. Save your first one!";
    historyList.appendChild(empty);
    return;
  }

  entries.forEach(function (entry) {
    const div = document.createElement("div");
    div.className = "entry";

    // Emoji
    const emojiSpan = document.createElement("span");
    emojiSpan.className = "emoji";
    emojiSpan.textContent = emojis[entry.mood] || "❓";

    // Info (date + note) — uses textContent to avoid XSS
    const infoDiv = document.createElement("div");
    infoDiv.className = "info";

    const dateDiv = document.createElement("div");
    dateDiv.className = "date";
    dateDiv.textContent = entry.date;

    const textDiv = document.createElement("div");
    textDiv.className = "text";
    textDiv.textContent = entry.note || "";

    infoDiv.appendChild(dateDiv);
    infoDiv.appendChild(textDiv);

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete";
    deleteButton.dataset.id = entry.id;
    deleteButton.textContent = "✕";

    div.appendChild(emojiSpan);
    div.appendChild(infoDiv);
    div.appendChild(deleteButton);

    historyList.appendChild(div);
  });
}

// ===== Load stats =====
async function loadStats() {
  const response = await fetch("/stats");
  const data = await response.json();

  if (data.total === 0) {
    stats.textContent = "";
    return;
  }

  const emoji = data.mostFrequentMood ? emojis[data.mostFrequentMood] : "";

  const noun = data.total === 1 ? "entry" : "entries";
  stats.textContent = `${data.total} ${noun} · most frequent mood: ${emoji}`;
}

// ===== Delete entry (event delegation) =====
historyList.addEventListener("click", async function (event) {
  if (event.target.classList.contains("delete")) {
    const id = event.target.dataset.id;
    await fetch(`/entries/${id}`, { method: "DELETE" });
    loadHistory();
    loadStats();
  }
});

// ===== When the page opens =====
loadHistory();
loadStats();

// ===== THEME (remembered between visits) =====
const themeButton = document.querySelector("#theme-toggle");
const body = document.body;

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "light") {
  body.classList.remove("dark");
  themeButton.textContent = "🌙";
} else {
  body.classList.add("dark");
  themeButton.textContent = "☀️";
}

themeButton.addEventListener("click", function () {
  body.classList.toggle("dark");

  if (body.classList.contains("dark")) {
    themeButton.textContent = "☀️";
    localStorage.setItem("theme", "dark");
  } else {
    themeButton.textContent = "🌙";
    localStorage.setItem("theme", "light");
  }
});
