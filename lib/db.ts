import fs from "fs";
import path from "path";

export interface SubmittedPhrase {
  id: string;
  text: string;
  author: string;
  department: string;
  country: string;
  timestamp: string;
  status: "approved" | "pending" | "deleted";
  position: [number, number, number];
  color?: string;
  isCustom: boolean;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "phrases.json");

function ensureDataFile() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2), "utf-8");
  }
}

export function getAllPhrases(): SubmittedPhrase[] {
  try {
    ensureDataFile();
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (e) {
    console.error("Error reading phrases database:", e);
    return [];
  }
}

export function getApprovedPhrases(): SubmittedPhrase[] {
  const all = getAllPhrases();
  return all.filter((p) => p.status === "approved");
}

export function addPhrase(data: {
  text: string;
  author: string;
  department: string;
  country?: string;
}): SubmittedPhrase {
  ensureDataFile();
  const all = getAllPhrases();

  // Generate random spatial coordinates in outer orbital ring
  const angle = Math.random() * Math.PI * 2;
  const radius = 4.2 + Math.random() * 2.2;
  const z = (Math.random() - 0.5) * 2.4;

  const newPhrase: SubmittedPhrase = {
    id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: data.text.trim().toUpperCase(),
    author: data.author.trim() || "Colaborador Tritech",
    department: data.department.trim() || "Grupo Tritech",
    country: data.country || data.department || "Guatemala",
    timestamp: new Date().toISOString(),
    status: "approved",
    position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.75, z],
    color: "#f59e0b", // Golden accent for user contributed phrases
    isCustom: true,
  };

  all.unshift(newPhrase);
  fs.writeFileSync(DATA_FILE, JSON.stringify(all, null, 2), "utf-8");
  return newPhrase;
}

export function deletePhrase(id: string): boolean {
  ensureDataFile();
  const all = getAllPhrases();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length !== all.length) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), "utf-8");
    return true;
  }
  return false;
}
