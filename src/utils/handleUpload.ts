import cloudinary from "../config/cloudinary.js";

export const uploadImageToCloudinary = async (
  imageFile: Express.Multer.File
): Promise<any> => {
  const b64 = imageFile.buffer.toString("base64");
  let dataURI = "data:" + imageFile.mimetype + ";base64," + b64;
  const uploadResponse = await cloudinary.uploader.upload(dataURI, {
    resource_type: "image",
    folder: "social_media_posts",
    transformation: [
      { width: 800, height: 600, crop: "limit" },
      { quality: "auto" },
      { format: "auto" },
    ],
  });
  return uploadResponse;
};
