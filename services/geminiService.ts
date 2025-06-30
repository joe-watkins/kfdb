import { GoogleGenAI } from "@google/genai";

if (!process.env.VITE_API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.VITE_API_KEY });
const model = "gemini-2.5-flash-preview-04-17";

interface KFDBSuggestions {
  title: string;
  know: string[];
  feel: string[];
  do: string[];
  be: string[];
}

function parseJsonFromText(text: string): any {
    let jsonStr = text.trim();
    const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
        jsonStr = match[2].trim();
    }
    try {
        // Attempt to fix common AI mistakes like trailing commas
        const sanitizedJsonStr = jsonStr
            .replace(/,\s*\]/g, ']') // remove trailing commas from arrays
            .replace(/,\s*}/g, '}'); // remove trailing commas from objects
        return JSON.parse(sanitizedJsonStr);
    } catch (e) {
        console.error("Failed to parse JSON response:", e);
        console.error("Problematic JSON string:", jsonStr);
        throw new Error("The AI returned a response that was not valid JSON. Please try again.");
    }
}


export const getInitialSuggestions = async (topic: string): Promise<KFDBSuggestions> => {
    const systemInstruction = `You are an expert curriculum designer and leadership coach specializing in the "Know, Feel, Do, Be" framework. Your sole function is to return valid, minified JSON. Do not include markdown, comments, or any conversational text. Your entire response must be ONLY the JSON object.`;
    
    const prompt = `
    For the session topic "${topic}", generate a "Know, Feel, Do, Be" plan.
    Create a concise title (3-7 words) and 2-3 distinct ideas for each category.
    
    Return a single, minified, valid JSON object with this exact structure, ensuring no trailing commas:
    {
      "title": "string",
      "know": ["string", "string"],
      "feel": ["string", "string"],
      "do": ["string", "string"],
      "be": ["string", "string"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });

    const parsedData = parseJsonFromText(response.text);
    
    // Validate the structure
    if (
      !parsedData ||
      typeof parsedData.title !== 'string' ||
      !Array.isArray(parsedData.know) ||
      !Array.isArray(parsedData.feel) ||
      !Array.isArray(parsedData.do) ||
      !Array.isArray(parsedData.be)
    ) {
      throw new Error("AI response did not match the expected format.");
    }
    
    return parsedData;

  } catch (error) {
    console.error("Error fetching initial suggestions from Gemini:", error);
    // Let the specific error from parseJsonFromText or the API call propagate up
    throw error;
  }
};

export const getIdeasForCategory = async (topic: string, category: string, existingItems: string[]): Promise<string[]> => {
    const systemInstruction = `You are an expert curriculum designer specializing in the "Know, Feel, Do, Be" framework. Your sole function is to return valid, minified JSON. Do not include markdown, comments, or any conversational text. Your entire response must be ONLY the JSON object.`;

    const prompt = `
    The session topic is "${topic}".
    The category is "${category}".
    Existing items are: ${JSON.stringify(existingItems)}.

    Generate exactly 3 new, diverse ideas for the "${category}" category. Do not repeat existing items.

    Return a single, minified, valid JSON object with this exact structure, ensuring no trailing commas:
    {
      "ideas": ["new idea 1", "new idea 2", "new idea 3"]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      }
    });
    
    const parsedData = parseJsonFromText(response.text);

    if (!parsedData || !Array.isArray(parsedData.ideas)) {
       throw new Error("AI response did not match the expected format for category ideas.");
    }

    return parsedData.ideas;

  } catch (error) {
    console.error(`Error fetching ideas for ${category} from Gemini:`, error);
    // Let the specific error propagate up
    throw error;
  }
};