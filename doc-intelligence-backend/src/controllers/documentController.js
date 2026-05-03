import fs from "fs/promises";
import path from "path";
import pdfParse from "pdf-parse";
import { query } from "../db.js";
import { extractDocumentData } from "../services/celebrasClient.js";

const uploadsDir = path.resolve(process.cwd(), "uploads");

const ensureUploadsDirectory = async () => {
  await fs.mkdir(uploadsDir, { recursive: true });
};

const parsePdfText = async (filePath) => {
  const fileBuffer = await fs.readFile(filePath);
  const data = await pdfParse(fileBuffer);
  return data.text || "";
};

const parseTextFile = async (filePath) => {
  return fs.readFile(filePath, "utf-8");
};

const extractTextFromFile = async (filePath, mimeType) => {
  try {
    if (mimeType === "application/pdf") {
      return await parsePdfText(filePath);
    }

    return await parseTextFile(filePath);
  } catch (error) {
    console.warn(`Unable to parse file type ${mimeType}:`, error.message);
    return "";
  }
};

export const uploadDocument = async (req, res) => {
  try {
    console.log("Upload request received", {
      fileName: req.file?.originalname,
      mimeType: req.file?.mimetype,
    });

    await ensureUploadsDirectory();

    if (!req.file) {
      console.warn("Upload failed: no file provided");
      return res.status(400).json({ error: "No file uploaded." });
    }

    const sourcePath = req.file.path;
    const targetPath = path.join(uploadsDir, `${Date.now()}-${req.file.originalname}`);
    await fs.rename(sourcePath, targetPath);
    const fileUrl = `/uploads/${path.basename(targetPath)}`;

    const text = await extractTextFromFile(targetPath, req.file.mimetype);
    console.log("File text extracted", { length: text.length, mimeType: req.file.mimetype });
    const extractedData = await extractDocumentData(text);
    console.log("Document extraction result", { extractedData });

    const result = await query(
      `INSERT INTO documents (file_name, file_path, full_text, vendor, invoice_number, invoice_date, amount, processed)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.file.originalname,
        targetPath,
        text,
        extractedData.vendor || null,
        extractedData.invoice_number || null,
        extractedData.invoice_date || null,
        extractedData.amount || null,
        1,
      ]
    );

    const documentId = result.insertId;

    await query(
      `INSERT INTO document_extracts (document_id, data)
       VALUES (?, ?)`,
      [documentId, JSON.stringify(extractedData)]
    );

    const document = {
      id: documentId,
      file_name: req.file.originalname,
      file_path: targetPath,
      file_url: fileUrl,
      vendor: extractedData.vendor || null,
      invoice_number: extractedData.invoice_number || null,
      invoice_date: extractedData.invoice_date || null,
      amount: extractedData.amount || null,
      processed: true,
      extracted_data: extractedData,
    };

    return res.status(201).json(document);
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: error.message || "Upload failed." });
  }
};

export const getDocuments = async (req, res) => {
  try {
    console.log("Fetching all documents");
    const rows = await query(`SELECT id, file_name, vendor, invoice_number, invoice_date, amount, processed, uploaded_at FROM documents ORDER BY uploaded_at DESC`);
    console.log(`Fetched ${rows.length} documents`);
    return res.json(rows);
  } catch (error) {
    console.error("Get documents error:", error);
    return res.status(500).json({ error: "Unable to load documents." });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    console.log("Fetching document by ID", { documentId: req.params.id });
    const documentRows = await query(`SELECT * FROM documents WHERE id = ?`, [req.params.id]);
    const document = documentRows[0];

    if (!document) {
      console.warn("Document not found", { documentId: req.params.id });
      return res.status(404).json({ error: "Document not found." });
    }

    const fileUrl = `/uploads/${path.basename(document.file_path)}`;
    const extractRows = await query(`SELECT data, created_at FROM document_extracts WHERE document_id = ? ORDER BY created_at DESC LIMIT 1`, [req.params.id]);
    const extractedData = extractRows[0]?.data || null;
    console.log("Fetched document details", { documentId: req.params.id, extractedDataFound: Boolean(extractedData), fileUrl });

    return res.json({ ...document, file_url: fileUrl, extracted_data: extractedData });
  } catch (error) {
    console.error("Get document by id error:", error);
    return res.status(500).json({ error: "Unable to load document." });
  }
};

export const searchDocuments = async (req, res) => {
  try {
    const searchQuery = req.query.q || "";
    console.log("Searching documents", { searchQuery });
    const rows = await query(
      `SELECT id, file_name, vendor, invoice_number, invoice_date, amount, processed, uploaded_at
       FROM documents
       WHERE file_name LIKE ? OR vendor LIKE ?
       ORDER BY uploaded_at DESC`,
      [`%${searchQuery}%`, `%${searchQuery}%`]
    );
    console.log(`Search returned ${rows.length} documents for query:`, searchQuery);
    return res.json(rows);
  } catch (error) {
    console.error("Search documents error:", error);
    return res.status(500).json({ error: "Search failed." });
  }
};
