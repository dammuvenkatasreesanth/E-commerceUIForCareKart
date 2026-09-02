import { v2 as cloudinary } from "cloudinary";
import { Readable } from "node:stream";
import { randomUUID } from "node:crypto";
import { env } from "../../config/env";
import { BadRequestError } from "../../lib/errors";

let configured = false;

function assertConfigured() {
  if (!env.CLOUDINARY_CLOUD_NAME || !env.CLOUDINARY_API_KEY || !env.CLOUDINARY_API_SECRET) {
    throw new BadRequestError("Uploads aren't configured yet — set CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET.");
  }
  if (!configured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
}

// `subdir` mirrors the old R2 key prefixes (e.g. "product-images",
// "product-videos", "banner-images") — kept as a Cloudinary folder so
// uploads stay organized the same way in the new provider.
export function uploadToCloudinary(subdir: string, buffer: Buffer, _ext: string, contentType: string): Promise<string> {
  assertConfigured();
  const resourceType = contentType.startsWith("video/") ? "video" : "image";

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `carekart/${subdir}`, public_id: randomUUID(), resource_type: resourceType },
      (error, result) => {
        if (error || !result) {
          reject(error instanceof Error ? error : new Error("Cloudinary upload failed"));
          return;
        }
        resolve(result.secure_url);
      },
    );
    Readable.from(buffer).pipe(stream);
  });
}
