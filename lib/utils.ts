import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBadgeId(): string {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `TRITECH-52-${randomNum}`;
}
