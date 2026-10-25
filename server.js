const express = require("express");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

// READ all entries (most recent first)
app.get("/entries", function (req, res) {
  const entries = db
    .prepare("SELECT * FROM entries ORDER BY date DESC, id DESC")
    .all();
  res.json(entries);
});

// CREATE or UPDATE the entry for a day
app.post("/entries", function (req, res) {
  const { date, mood, note } = req.body;

  if (!date || !mood) {
    return res.status(400).json({ error: "Date and mood are required" });
  }

  // Is there already an entry for this day?
  const existing = db
    .prepare("SELECT * FROM entries WHERE date = ?")
    .get(date);

  if (existing) {
    // Update that day's entry instead of creating another one
    db.prepare(
      "UPDATE entries SET mood = ?, note = ? WHERE date = ?",
    ).run(mood, note || "", date);

    const updated = db
      .prepare("SELECT * FROM entries WHERE date = ?")
      .get(date);
    return res.status(200).json(updated);
  }

  // Otherwise, create a new one
  const result = db
    .prepare("INSERT INTO entries (date, mood, note) VALUES (?, ?, ?)")
    .run(date, mood, note || "");

  const newEntry = db
    .prepare("SELECT * FROM entries WHERE id = ?")
    .get(result.lastInsertRowid);

  res.status(201).json(newEntry);
});

// STATS
app.get("/stats", function (req, res) {
  const total = db.prepare("SELECT COUNT(*) AS n FROM entries").get().n;

  const mostFrequent = db
    .prepare(
      "SELECT mood, COUNT(*) AS n FROM entries GROUP BY mood ORDER BY n DESC LIMIT 1",
    )
    .get();

  res.json({
    total: total,
    mostFrequentMood: mostFrequent ? mostFrequent.mood : null,
  });
});

// DELETE an entry
app.delete("/entries/:id", function (req, res) {
  const id = Number(req.params.id);

  const result = db.prepare("DELETE FROM entries WHERE id = ?").run(id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Entry not found" });
  }

  res.status(204).send();
});

app.listen(PORT, function () {
  console.log(`Server running at http://localhost:${PORT}`);
});
