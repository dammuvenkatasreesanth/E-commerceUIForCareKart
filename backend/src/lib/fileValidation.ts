import { BadRequestError } from "./errors";

const IMAGE_EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_EXT_BY_MIME: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/ogg": "ogv",
  "video/quicktime": "mov",
};

// Never derive the stored extension from the client-supplied filename — it's
// fully attacker-controlled. Always look it up from a fixed mimetype table,
// and explicitly deny anything that could be served as active content.
const DENYLIST_EXT = new Set(["html", "htm", "xhtml", "svg", "js", "php"]);

export async function validateUploadedFile(
  buffer: Buffer,
  declaredMimetype: string,
  kind: "image" | "video",
): Promise<{ ext: string; contentType: string }> {
  const table = kind === "image" ? IMAGE_EXT_BY_MIME : VIDEO_EXT_BY_MIME;
  const ext = table[declaredMimetype];
  if (!ext || DENYLIST_EXT.has(ext)) {
    throw new BadRequestError(`Unsupported ${kind} type.`);
  }

  // file-type is ESM-only; dynamic import() is the supported way to consume
  // an ESM package from this CommonJS backend.
  const { fileTypeFromBuffer } = await import("file-type");
  const detected = await fileTypeFromBuffer(buffer);
  if (!detected || detected.mime !== declaredMimetype) {
    throw new BadRequestError("File content does not match its declared type.");
  }

  return { ext, contentType: declaredMimetype };
}
