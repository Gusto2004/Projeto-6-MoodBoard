const Database = require("better-sqlite3");
const db = new Database("moodboard.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS registos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    data TEXT NOT NULL,
    humor TEXT NOT NULL,
    nota TEXT
  )
`);

module.exports = db;
