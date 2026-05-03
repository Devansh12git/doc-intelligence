# Sample Invoice Files for Testing

This directory contains sample invoice files to test the Document Intelligence application.

## Files Available

1. **sample-invoice.txt** - Professional services invoice from ABC Corporation
   - Vendor: ABC Corporation
   - Invoice: INV-2026-001
   - Amount: $12,057.50

2. **sample-invoice-2.txt** - Industrial supplies invoice from XYZ Traders
   - Vendor: XYZ Traders Ltd.
   - Invoice: XT-2026-045
   - Amount: $45,955.00

3. **sample-invoice-3.txt** - Office supplies invoice from Premium Office Supplies
   - Vendor: Premium Office Supplies Co.
   - Invoice: REC-2026-078
   - Amount: $728.91

## How to Use

### Option 1: Upload as Text Files
The application accepts both PDF and text files. You can upload these .txt files directly to test the text extraction and AI processing.

### Option 2: Convert to PDF
1. Open any of the .txt files
2. Print to PDF using your system's print dialog (Ctrl+P → Save as PDF)
3. Upload the resulting PDF file

## Expected Results

When uploaded, the Cerebras AI API should extract:
- Vendor name
- Invoice number
- Invoice date
- Total amount
- Summary of items/services
- Line items (where applicable)

## Testing the Full Application

1. Start the backend: `cd doc-intelligence-backend && npm run dev`
2. Start the frontend: `cd doc-intelligence-frontend && npm run dev`
3. Open http://localhost:5173
4. Upload a sample file
5. Check the extracted data display
6. View documents in Dashboard
7. Test search functionality

The application will automatically extract invoice data using Cerebras AI and store it in the MySQL database.