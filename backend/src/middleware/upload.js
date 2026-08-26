import multer from "multer";
import { AppError } from "./errorHandler.js";

export const MAX_COMPLAINT_ATTACHMENTS = 5;
export const MAX_COMPLAINT_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const hasValidImageSignature = (buffer, mimetype) => {
  if (!buffer || buffer.length < 12) return false;

  if (
    mimetype === "image/jpeg"
  ) {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (mimetype === "image/png") {
    return buffer.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
    );
  }

  if (mimetype === "image/gif") {
    const header = buffer.subarray(0, 6).toString("ascii");
    return header === "GIF87a" || header === "GIF89a";
  }

  if (mimetype === "image/webp") {
    return (
      buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
      buffer.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }

  return false;
};

const imageUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    files: MAX_COMPLAINT_ATTACHMENTS,
    fileSize: MAX_COMPLAINT_ATTACHMENT_SIZE,
  },
  fileFilter: (_req, file, callback) => {
    if (!IMAGE_MIME_TYPES.has(file.mimetype)) {
      callback(new AppError("Only JPEG, PNG, WebP, and GIF images are allowed", 400));
      return;
    }

    callback(null, true);
  },
});

export const uploadComplaintAttachments = (req, res, next) => {
  imageUpload.array("attachments", MAX_COMPLAINT_ATTACHMENTS)(req, res, (error) => {
    if (!error) {
      const invalidFile = (req.files || []).find(
        (file) => !hasValidImageSignature(file.buffer, file.mimetype)
      );

      if (invalidFile) {
        next(new AppError("One or more uploaded files are not valid images", 400));
        return;
      }

      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      if (error.code === "LIMIT_FILE_SIZE") {
        next(new AppError("Each image must be 5 MB or smaller", 400));
        return;
      }

      if (error.code === "LIMIT_FILE_COUNT" || error.code === "LIMIT_UNEXPECTED_FILE") {
        next(new AppError("You can attach up to 5 images", 400));
        return;
      }
    }

    next(error);
  });
};
