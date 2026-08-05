import multer from "multer";

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) {
    cb(new Error("Only image files are allowed"));
    return;
  }
  cb(null, true);
};

const videoFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  if (!/^video\/(mp4|webm|ogg|quicktime)$/.test(file.mimetype)) {
    cb(new Error("Only video files are allowed"));
    return;
  }
  cb(null, true);
};

// Buffered in memory rather than written to disk — the real content
// validation (magic-number check) and the R2 upload both need the bytes,
// and neither is a local filesystem operation anymore.
export const uploadProductImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadBannerImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadCategoryImage = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadProductVideo = multer({
  storage: multer.memoryStorage(),
  fileFilter: videoFileFilter,
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
