import { GoogleGenAI } from "@google/genai";
import { PresentationConfig } from "../types/presentation-schema";
import { MOCK_PRESENTATION } from "../data/mockPresentation";

// Initialize AI Client
// Note: process.env.API_KEY is assumed to be injected by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_PROMPT = `
You are a Professional Presentation Designer AI.
Your goal is to generate a JSON configuration for a slide deck based on the user's request.

### RULES
1. **Output JSON ONLY**: No conversational text.
2. **Follow Schema**: Strictly adhere to the PresentationConfig interface.
3. **Use Semantic Tokens**: For colors, use 'theme.colors.primary' instead of hex codes. For text styles, use 'h1', 'h2', 'body'.
4. **Layout Intelligence**:
   - Title Slides: Use large centered H1s.
   - Comparison Slides: Use 2-column layouts.
   - Data Slides: Always include a 'chart' element if numbers are mentioned.
5. **Animation Strategy**:
   - Add animation: { type: 'slide-up', duration: 500, delay: 0 } to titles.
   - Add delay: 200 to body text so it appears after the title.

### OUTPUT FORMAT
Returns JSON matching the PresentationConfig interface.
`;

export const generatePresentation = async (userPrompt: string): Promise<PresentationConfig> => {
  // Fallback if no API key is present (Development Mode)
  if (!process.env.API_KEY) {
    console.warn("AiService: No API Key found. Using Mock Data.");
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    return MOCK_PRESENTATION;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: userPrompt,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");

    const data = JSON.parse(text) as PresentationConfig;
    return data;
  } catch (error) {
    console.error("AiService Error:", error);
    // In production, you might want to throw, but for this demo app we fallback to mock
    return MOCK_PRESENTATION;
  }
};