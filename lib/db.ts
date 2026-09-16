import fs from "fs";
import path from "path";
import os from "os";

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

const PRIMARY_DATA_DIR = path.join(process.cwd(), "data");
const PRIMARY_DATA_FILE = path.join(PRIMARY_DATA_DIR, "phrases.json");
const FALLBACK_DATA_FILE = path.join(os.tmpdir(), "52year-phrases.json");

// In-memory cache fallback to ensure phrase operations NEVER crash in read-only environments
let inMemoryPhrases: SubmittedPhrase[] | null = null;

function resolveDataFilePath(): string {
  try {
    if (!fs.existsSync(PRIMARY_DATA_DIR)) {
      fs.mkdirSync(PRIMARY_DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(PRIMARY_DATA_FILE)) {
      fs.writeFileSync(PRIMARY_DATA_FILE, JSON.stringify([], null, 2), "utf-8");
    }
    fs.accessSync(PRIMARY_DATA_FILE, fs.constants.W_OK);
    return PRIMARY_DATA_FILE;
  } catch {
    // Primary path is not writable (e.g. Vercel serverless read-only filesystem)
    try {
      if (!fs.existsSync(FALLBACK_DATA_FILE)) {
        fs.writeFileSync(FALLBACK_DATA_FILE, JSON.stringify([], null, 2), "utf-8");
      }
      return FALLBACK_DATA_FILE;
    } catch {
      return "";
    }
  }
}

function loadPhrasesFromFile(): SubmittedPhrase[] {
  const filePath = resolveDataFilePath();
  if (filePath && fs.existsSync(filePath)) {
    try {
      const raw = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error("Error reading phrases file:", e);
    }
  }
  return [];
}

function savePhrasesToFile(phrases: SubmittedPhrase[]): boolean {
  const filePath = resolveDataFilePath();
  if (filePath) {
    try {
      fs.writeFileSync(filePath, JSON.stringify(phrases, null, 2), "utf-8");
      return true;
    } catch (e) {
      console.error("Error writing phrases to file:", e);
    }
  }
  return false;
}

export function getAllPhrases(): SubmittedPhrase[] {
  if (inMemoryPhrases === null) {
    inMemoryPhrases = loadPhrasesFromFile();
  }
  return inMemoryPhrases;
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
  const all = getAllPhrases();

  // Generate random spatial coordinates in outer orbital ring (Spacious clearance around core)
  const angle = Math.random() * Math.PI * 2;
  const radius = 6.8 + Math.random() * 3.7;
  const z = (Math.random() - 0.5) * 2.8;

  const newPhrase: SubmittedPhrase = {
    id: `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    text: data.text.trim().toUpperCase(),
    author: data.author.trim() || "Colaborador Tritech",
    department: data.department.trim() || "Grupo Tritech",
    country: data.country || data.department || "Guatemala",
    timestamp: new Date().toISOString(),
    status: "approved",
    position: [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.75, z],
    color: "#fbbf24", // Exclusive Golden Amber Glow for custom user messages
    isCustom: true,
  };

  all.unshift(newPhrase);
  inMemoryPhrases = all;
  savePhrasesToFile(all);
  return newPhrase;
}

export function deletePhrase(id: string): boolean {
  const all = getAllPhrases();
  const filtered = all.filter((p) => p.id !== id);
  if (filtered.length !== all.length) {
    inMemoryPhrases = filtered;
    savePhrasesToFile(filtered);
    return true;
  }
  return false;
}

