import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import { initDatabase } from "./db.js";
import { listAvailableModels } from "./services/celebrasClient.js";
import documentRoutes from "./routes/documentRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const uploadsPath = path.join(__dirname, "../uploads");

await fs.mkdir(uploadsPath, { recursive: true });

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

app.use("/uploads", express.static(uploadsPath));
app.use("/api", documentRoutes);

app.get("/", (req, res) => {
  console.log("Received health check request");
  res.send("Doc Intelligence Backend is running.");
});

const PORT = process.env.PORT || 5000;

const testCerebrasConnection = async () => {
  try {
    const models = await listAvailableModels();
    if (models.length > 0) {
      console.log(`✓ Cerebras API connected. Available models: ${models.map(m => m.id).join(", ")}`);
      return true;
    }
  } catch (error) {
    console.warn("⚠ Could not verify Cerebras API. Make sure your CEREBRAS_API_KEY is valid.");
  }
  return false;
};

initDatabase()
  .then(async () => {
    await testCerebrasConnection();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });
