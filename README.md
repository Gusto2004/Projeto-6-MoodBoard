# MoodBoard — Mood Diary

A full-stack app to log your mood each day, with an optional note, and review your history over time. It was my first full-stack project, with its own backend and a persistent database.

## Features

- Log your mood for the day (5 states, shown as emojis)
- Add an optional note to each entry
- Only one entry per day: saving again on the same day updates the existing entry
- Statistics: total number of entries and most frequent mood
- Browse your history, ordered from newest to oldest
- Delete entries
- Data is stored in a database (it persists between server restarts)
- Dark / light mode with a toggle button, remembered between visits

## Technologies

- **Frontend:** HTML5, CSS3 (CSS variables), JavaScript (fetch, async/await)
- **Backend:** Node.js, Express
- **Database:** SQLite (via better-sqlite3)

## Architecture

The same Express server serves the frontend (the `public` folder) and exposes a REST API that talks to the SQLite database. The frontend talks to that API using `fetch` requests.

## API endpoints

| Method   | Route          | Description                                                        |
| -------- | -------------- | ------------------------------------------------------------------ |
| `GET`    | `/entries`     | Returns all entries (newest first)                                 |
| `POST`   | `/entries`     | Creates an entry, or updates the one for the same day if it exists |
| `GET`    | `/stats`       | Returns the total number of entries and the most frequent mood     |
| `DELETE` | `/entries/:id` | Deletes the entry with that id                                     |

The `mood` field is one of `happy`, `good`, `neutral`, `sad` or `bad`.

## Database structure

Table `entries`:

| Column | Type    | Description                             |
| ------ | ------- | --------------------------------------- |
| `id`   | INTEGER | Unique identifier (auto-increment)      |
| `date` | TEXT    | Date of the entry (format `YYYY-MM-DD`) |
| `mood` | TEXT    | Chosen mood                             |
| `note` | TEXT    | Optional note                           |

## Concepts practiced

- Persisting data with SQLite and _prepared statements_ (protection against SQL injection)
- "Create or update" logic (avoiding duplicate entries on the same day)
- SQL aggregation queries (`COUNT`, `GROUP BY`) for the statistics
- Communication between the frontend and my own backend using `fetch`
- Serving static files with Express (`express.static`)
- Building the DOM safely with `textContent` (protection against XSS)
- Event delegation and dynamic DOM rendering

## How to run

```bash
npm install
node server.js
```

Then open `http://localhost:3000` in your browser.

## Note

This project has a backend and a database, so it can't be published on GitHub Pages (which only serves static files). To put it online you would need a service that runs Node.js, such as Render or Railway.

## Next steps

- [ ] Visual history as a calendar, colored by mood
- [ ] Filter the history by month
- [ ] Deploy online
