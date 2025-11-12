import multer from "multer";
import DataUriParser from "datauri/parser.js";
import path from "path";

const storage = multer.memoryStorage();
const parser = new DataUriParser();

export const multiUpload = multer({ storage }).fields([
  { name: "resume", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "file", maxCount: 1 }    // ✅ Add this line
]);


export const getDataUri = (file) => {
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
};
