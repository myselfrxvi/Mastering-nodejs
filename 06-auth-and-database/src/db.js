import { DatabaseSync } from "node:sqlite";
import path from "node:path";
const dbPath = path.join('06-auth-and-database', 'vault.db')
export const db = new DatabaseSync(dbPath)

db.exec(`
    CREATE TABLE IF NOT EXISTS (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    salt TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    token TEXT 
    );
    CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );
`);
console.log('📦 SQLite Database initialized at:', dbPath);