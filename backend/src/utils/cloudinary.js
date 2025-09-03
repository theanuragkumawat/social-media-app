import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) {
         return null;
      }
      // Upload the image
      const result = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
      });
      console.log("file uploaded on cloudinary", result);
      return result;
   } catch (error) {
      console.error(error);
      return null
   } finally {
      fs.unlinkSync(localFilePath);
   }
};

export { uploadOnCloudinary };
