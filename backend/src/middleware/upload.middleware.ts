import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { ensureUploadSubdir } from "../providers/storage/local-storage";

function makeStorage(subdir: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, ensureUploadSubdir(subdir)),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  });
}

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};

export const uploadProductImage = multer({
  storage: makeStorage("product-images"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadBannerImage = multer({
  storage: makeStorage("banners"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCategoryImage = multer({
  storage: makeStorage("categories"),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductVideo = multer({
  storage: makeStorage("product-videos"),
  fileFilter: (_req, file, cb) => {
    if (!/^video\/(mp4|webm|ogg|quicktime)$/.test(file.mimetype)) {
      cb(new Error("Only video files are allowed"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 50 * 1024 * 1024 },
});

export const uploadCsv = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    if (!/\.(csv)$/i.test(file.originalname)) {
      cb(new Error("Only .csv files are allowed"));
      return;
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});
