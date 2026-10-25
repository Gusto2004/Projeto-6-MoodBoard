const Database = require("better-sqlite3");
const db = new Database("moodboard.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    mood TEXT NOT NULL,
    note TEXT
  )
`);

module.exports = db;
