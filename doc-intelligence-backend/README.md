# Doc Intelligence Backend

This backend provides document upload, storage, search, and extraction services using MySQL and the Cerebras AI API.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment variables:
   ```bash
   cp .env.example .env
   ```

3. Update `.env` with your MySQL and Cerebras credentials:
   - Get your Cerebras API key from https://console.cerebras.ai
   - Set `CEREBRAS_API_KEY` to your API key (starts with `csk-`)
   - Set `CEREBRAS_MODEL` to an available model name
   
   Common models:
   - `llama-3.1-70b-instruct` - Recommended for general use (fast & accurate)
   - `llama-3.1-8b-instruct` - Faster, smaller model
   - `llama-2-70b-chat` - Alternative older model
   
   **Important**: Check your available models at https://console.cerebras.ai/ and verify the exact model names. The server will display available models on startup.

4. Start the server:
   ```bash
   npm run dev
   ```
   
   On startup, the server will show the available models if the API connection is successful.

## API Endpoints

- `POST /api/upload` - Upload a document file and extract intelligence.
- `GET /api/documents` - List stored documents.
- `GET /api/document/:id` - Get document details and extracted data.
- `GET /api/search?q=...` - Search documents by file name or vendor.

## Database

The backend initializes the `doc_intelligence` database and creates the `documents` and `document_extracts` tables automatically on startup.

## Cerebras API

This uses Cerebras' fastest inference AI models for document extraction. The gpt-oss-120b model provides excellent accuracy and speed for invoice and document processing.
