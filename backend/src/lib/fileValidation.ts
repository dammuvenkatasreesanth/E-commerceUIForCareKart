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
  if (!detected) {
    throw new BadRequestError("File content does not match its declared type.");
  }

  // Trust the sniffed bytes over the browser-declared mimetype, as long as
  // they land on something in the same allowlisted table — requiring an
  // *exact* match rejected real files. Phones commonly hand the browser one
  // label (e.g. iOS reporting "video/quicktime" for a .mov that is actually
  // ISO-BMFF/MP4-compatible underneath, or a browser normalizing "image/jpg"
  // vs "image/jpeg") while the true content is still a perfectly valid file
  // of the same kind. Using the detected type as the source of truth for
  // ext/contentType keeps the security property (bytes are genuinely a
  // supported image/video) without those false-positive rejections.
  const detectedExt = table[detected.mime];
  if (!detectedExt) {
    throw new BadRequestError("File content does not match its declared type.");
  }

  return { ext: detectedExt, contentType: detected.mime };
}
