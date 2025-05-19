// Importing necessary modules
import multer from "multer";

// Multer middleware for file uploading
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public");
  },
  filename: (req, file, cb) => {
    const uniquename = Date.now() + "_" + file.originalname;
    cb(null, uniquename);
  },
});

// Upload function with a limit of 100MB
const upload = multer({ storage: storage, limits: 100 * 1024 * 1024 });

// Exporting the upload function for use in routes
export { upload };
