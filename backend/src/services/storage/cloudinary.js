import crypto from "node:crypto";
import { AppError } from "../../middleware/errorHandler.js";

const APPROVED_CLOUDINARY_HOSTNAMES = new Set(["res.cloudinary.com"]);

const validateCloudinarySecureUrl = (secureUrl) => {
  if (typeof secureUrl !== "string" || !secureUrl.trim()) {
    throw new AppError("Image storage returned an invalid image URL", 502);
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(secureUrl.trim());
  } catch {
    throw new AppError("Image storage returned an invalid image URL", 502);
  }

  if (
    parsedUrl.protocol !== "https:" ||
    !APPROVED_CLOUDINARY_HOSTNAMES.has(parsedUrl.hostname.toLowerCase()) ||
    parsedUrl.username ||
    parsedUrl.password ||
    parsedUrl.port
  ) {
    throw new AppError("Image storage returned an untrusted image URL", 502);
  }

  return parsedUrl.toString();
};

const getCloudinaryConfig = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new AppError("Image storage is not configured", 503);
  }

  return { cloudName, apiKey, apiSecret };
};

const createSignature = (params, apiSecret) => {
  const serializedParams = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .sort(([first], [second]) => first.localeCompare(second))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return crypto
    .createHash("sha1")
    .update(`${serializedParams}${apiSecret}`)
    .digest("hex");
};

export const uploadComplaintImage = async ({ buffer, mimetype, citizenId }) => {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = `nammanadu/complaints/${citizenId}`;
  const publicId = crypto.randomUUID();
  const signatureParams = {
    folder,
    public_id: publicId,
    timestamp,
  };

  const body = new FormData();
  body.append("file", new Blob([buffer], { type: mimetype }), `${publicId}.image`);
  body.append("api_key", apiKey);
  body.append("folder", folder);
  body.append("public_id", publicId);
  body.append("timestamp", String(timestamp));
  body.append("signature", createSignature(signatureParams, apiSecret));

  let response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`,
      {
        method: "POST",
        body,
      }
    );
  } catch {
    throw new AppError("Unable to reach image storage", 502);
  }

  let result = {};
  try {
    result = await response.json();
  } catch {
    // The provider response is not required to be JSON for the error below.
  }

  if (!response.ok) {
    throw new AppError("Unable to store complaint image", 502);
  }

  const secureUrl = validateCloudinarySecureUrl(result.secure_url);

  return {
    publicId: result.public_id || `${folder}/${publicId}`,
    url: secureUrl,
  };
};

export const deleteComplaintImage = async ({ publicId }) => {
  try {
    const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
    const timestamp = Math.floor(Date.now() / 1000);
    const signatureParams = {
      public_id: publicId,
      timestamp,
    };
    const body = new FormData();
    body.append("public_id", publicId);
    body.append("timestamp", String(timestamp));
    body.append("api_key", apiKey);
    body.append("signature", createSignature(signatureParams, apiSecret));

    await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
      {
        method: "POST",
        body,
      }
    );
  } catch {
    // Cleanup is best effort; the original request error is more useful to the client.
  }
};
