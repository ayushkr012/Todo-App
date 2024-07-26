import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const generateSignature = (req, res, next) => {
  const { folder } = req.body;

  if (!folder) {
    res.status(400);
    // return next(new Error("folder name is required"));
    console.log("folder name is required");
    return res.status(400).json({ message: "folder name is required" });
  }

  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder,
      },
      process.env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({ timestamp, signature });
  } catch (error) {
    console.log(error);
    res.status(500);
    next(error);
  }
};
