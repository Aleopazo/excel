import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");
const dbFile = path.join(dataDir, "medcare.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbFile);
db.pragma("journal_mode = WAL");

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('patient', 'doctor')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS cases (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_review',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  questionnaire TEXT NOT NULL,
  payment_reference TEXT,
  payment_amount REAL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  doctor_id INTEGER,
  medical_summary TEXT,
  FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY(doctor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS payments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id INTEGER NOT NULL,
  reference TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'manual',
  brand TEXT,
  last4 TEXT,
  amount REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'succeeded',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY(case_id) REFERENCES cases(id) ON DELETE CASCADE
);
`);

export const DEFAULT_DOCTOR_EMAIL = "clinico@auracare.com";
export const DEFAULT_DOCTOR_PASSWORD = "doctorSeguro2025";

const doctorExists = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(DEFAULT_DOCTOR_EMAIL);

if (!doctorExists) {
  const passwordHash = bcrypt.hashSync(DEFAULT_DOCTOR_PASSWORD, 10);
  db.prepare(
    "INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)",
  ).run("Dra. Valentina Rocha", DEFAULT_DOCTOR_EMAIL, passwordHash, "doctor");
}

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: "patient" | "doctor";
};

export default db;
