import { GoogleGenAI, Type } from "@google/genai";
import { PetNameResponse } from "../types";

/**
 * Encodes a string to a Base64 string.
 * This is a utility function as atob/btoa might not be available in all environments,
 * but for browser environments, they are standard.
 * @param str The string to encode.
 * @returns The Base64 encoded string.
 */
function encode(str: string): string {
  return btoa(str);
}

/**
 * Generates pet names using the Gemini API.
 * @param animalType The type of animal (e.g., "犬", "猫").
 * @returns A promise that resolves to an array of pet names.
 */
export const generatePetNames = async (animalType: string): Promise<string[]> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not defined in environment variables.");
  }

  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const model = "gemini-2.5-flash"; // Using a suitable model for text generation

  const prompt = `Generate 5 unique pet names for a "${animalType}". The names should be in Katakana (e.g., キュート, ミミ), easy to pronounce in Japanese, and suitable for the specified animal. Return the names as a JSON object with a single key "names" which is an array of strings.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            names: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: 'A pet name in Katakana.',
              },
              description: 'An array of suitable pet names in Katakana.',
            },
          },
          required: ['names'],
        },
      },
    });

    const jsonStr = response.text.trim();
    // The model might return a markdown-like code block for JSON, so we need to parse it.
    // Example: ```json\n{ "names": [...] }\n```
    const cleanedJsonStr = jsonStr.replace(/^```json\s*|\s*```$/g, '').trim();

    const result: PetNameResponse = JSON.parse(cleanedJsonStr);
    return result.names;
  } catch (error: any) {
    console.error("Error generating pet names:", error);
    // Specific error handling for "Requested entity was not found." for Veo model.
    // Although this app uses 'gemini-2.5-flash', it's good practice to show how it would be handled.
    if (error.message && error.message.includes("Requested entity was not found.")) {
      // In a real Veo app, you would prompt the user to re-select API key.
      // For this text generation app, we'll just throw the error.
      throw new Error("API key might be invalid or project not configured correctly. Please check your API key and project settings. Billing information: ai.google.dev/gemini-api/docs/billing");
    }
    throw new Error(`Failed to generate pet names: ${error.message || "Unknown error"}`);
  }
};
