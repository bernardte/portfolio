import { registerAs } from "@nestjs/config";

export default registerAs('cloudinaryconfig', () => ({
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_key_name: process.env.CLOUDINARY_KEY_NAME,
}));