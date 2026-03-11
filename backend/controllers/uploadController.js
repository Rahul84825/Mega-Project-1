const asyncHandler   = require("express-async-handler");
const { cloudinary } = require("../config/cloudinary");
const streamifier    = require("streamifier");

// POST /api/upload
const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No file uploaded");
  }

  // Upload buffer to Cloudinary via stream
  const uploadFromBuffer = () =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder:         "mahalaxmi_steels/products",
          transformation: [{ width: 800, height: 800, crop: "limit", quality: "auto" }],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });

  const result = await uploadFromBuffer();

  res.json({
    url:       result.secure_url,
    public_id: result.public_id,
  });
});

// DELETE /api/upload/:public_id
const deleteImage = asyncHandler(async (req, res) => {
  await cloudinary.uploader.destroy(req.params.public_id);
  res.json({ message: "Image deleted" });
});

module.exports = { uploadImage, deleteImage };