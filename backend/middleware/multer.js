import multer from "multer";
import DataUriParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();

// ✅ Must match the name used in FormData → "resume"
export const singleUpload = multer({ storage }).single("resume");

// Converts buffer → Data URI
export const getDataUri = (file) => {
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};
