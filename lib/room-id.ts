import { slugify } from "@/lib/slugify";

export function generateRoomId(name: string): string {
  const base = slugify(name) || "untitled-project";
  const suffix = crypto.randomUUID().slice(0, 6);
  return `${base}-${suffix}`;
}

export function buildRoomIdPreview(name: string, suffix: string): string {
  const base = slugify(name) || "untitled-project";
  return `${base}-${suffix}`;
}
