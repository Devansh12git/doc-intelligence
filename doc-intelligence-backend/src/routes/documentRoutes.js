import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadDocument, getDocuments, getDocumentById, searchDocuments } from "../controllers/documentController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadFolder = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    fs.mkdir(uploadFolder, { recursive: true }, (err) => cb(err, uploadFolder));
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const safeName = `${timestamp}-${file.originalname}`.replace(/\s+/g, "_");
    cb(null, safeName);
  },
});

const upload = multer({ storage });

const router = express.Router();

router.post("/upload", upload.single("file"), uploadDocument);
router.get("/documents", getDocuments);
router.get("/document/:id", getDocumentById);
router.get("/search", searchDocuments);

export default router;
