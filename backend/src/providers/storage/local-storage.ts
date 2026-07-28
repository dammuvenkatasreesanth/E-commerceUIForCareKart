import path from "node:path";
import fs from "node:fs";
import { env } from "../../config/env";

export const uploadRoot = path.resolve(__dirname, "../../../", env.UPLOAD_DIR);

export function ensureUploadSubdir(subdir: string): string {
  const dir = path.join(uploadRoot, subdir);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function publicUrlFor(subdir: string, filename: string): string {
  return `${env.PUBLIC_UPLOAD_BASE_URL}/${subdir}/${filename}`;
}
