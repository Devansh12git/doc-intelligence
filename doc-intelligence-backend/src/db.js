import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

if (!DB_HOST || !DB_USER || !DB_NAME) {
  throw new Error("Missing required database configuration in .env");
}

const rootPool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT || 3306,
  user: DB_USER,
  password: DB_PASSWORD || "",
  waitForConnections: true,
  connectionLimit: 10,
});

let dbPool;

export const initDatabase = async () => {
  await rootPool.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  dbPool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT || 3306,
    user: DB_USER,
    password: DB_PASSWORD || "",
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS documents (
      id INT AUTO_INCREMENT PRIMARY KEY,
      file_name VARCHAR(255) NOT NULL,
      file_path VARCHAR(512) NOT NULL,
      full_text LONGTEXT,
      vendor VARCHAR(255),
      invoice_number VARCHAR(128),
      invoice_date VARCHAR(64),
      amount DECIMAL(15,2),
      processed TINYINT(1) DEFAULT 0,
      uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await dbPool.query(`
    CREATE TABLE IF NOT EXISTS document_extracts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      document_id INT NOT NULL,
      data JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE
    )
  `);
};

export const query = async (sql, params = []) => {
  if (!dbPool) {
    throw new Error("Database pool is not initialized. Call initDatabase() first.");
  }
  const [rows] = await dbPool.execute(sql, params);
  return rows;
};
