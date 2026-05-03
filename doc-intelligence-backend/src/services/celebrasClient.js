import Cerebras from "@cerebras/cerebras_cloud_sdk";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.CEREBRAS_API_KEY;
const model = process.env.CEREBRAS_MODEL || "llama-3.1-70b-instruct";

if (!apiKey || apiKey.startsWith("your-")) {
  throw new Error(
    "Missing or placeholder CEREBRAS_API_KEY in environment configuration. Please set your Cerebras API key from https://console.cerebras.ai"
  );
}

const client = new Cerebras({
  apiKey,
});

// List available models
export const listAvailableModels = async () => {
  try {
    console.log("Listing Cerebras models...");
    const models = await client.models.list();
    console.log(`Retrieved ${models.data?.length || 0} models from Cerebras`);
    return models.data || [];
  } catch (error) {
    console.warn("Could not list models:", error.message);
    return [];
  }
};

const extractionPrompt = (text) => `Extract the key fields from the following invoice document text in valid JSON format with these exact keys: vendor, invoice_number, invoice_date, amount, summary, line_items.

Document text:
"""
${text}
"""

Return only valid JSON with these keys. Use null for missing values. For amount, extract the total amount as a number (without currency symbol). For line_items, provide an array of item descriptions if available.`;

export const extractDocumentData = async (text) => {
  try {
    console.log("Sending text extraction request to Cerebras", { model, textLength: text.length });
    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a document intelligence assistant that extracts invoice and purchase-order fields from raw text. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: extractionPrompt(text),
        },
      ],
      model,
      temperature: 0.0,
      max_tokens: 500,
    });

    const content = response?.choices?.[0]?.message?.content || "";
    console.log("Received Cerebras response", { contentLength: content.length });

    try {
      // Try to parse as direct JSON first
      return JSON.parse(content);
    } catch (parseError) {
      // Try to extract JSON from response that might have extra text
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch (secondParseError) {
          console.warn("Failed to parse extracted JSON:", secondParseError.message);
        }
      }

      // Fallback: return basic structure
      console.warn("AI response was not valid JSON, using fallback:", content);
      return {
        vendor: null,
        invoice_number: null,
        invoice_date: null,
        amount: null,
        summary: content.substring(0, 200),
        line_items: [],
      };
    }
  } catch (error) {
    console.error("Cerebras API Error:", error);
    console.error("Current model:", model);
    console.error("Available models can be found at: https://console.cerebras.ai/");
    throw new Error(`Failed to extract document data: ${error.message}`);
  }
};
