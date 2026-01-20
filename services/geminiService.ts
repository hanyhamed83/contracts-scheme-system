
import { GoogleGenAI, Type } from "@google/genai";
import { Scheme, AISchemeAnalysis, SchemePriority } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeScheme = async (scheme: Scheme): Promise<AISchemeAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following business scheme and provide a structured assessment:
    Title: ${scheme.title}
    Description: ${scheme.description}
    Category: ${scheme.category}
    Current Priority: ${scheme.priority}
    Budget: ${scheme.budget || 'Not specified'}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A concise 2-sentence summary of the scheme's objectives."
          },
          riskLevel: {
            type: Type.STRING,
            description: "Risk assessment level: Low, Medium, or High."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of 3 specific improvements or steps."
          },
          suggestedPriority: {
            type: Type.STRING,
            description: "Recommended priority level based on impact."
          }
        },
        required: ["summary", "riskLevel", "recommendations", "suggestedPriority"]
      }
    }
  });

  const analysis = JSON.parse(response.text);
  return analysis as AISchemeAnalysis;
};

export const generateGlobalReport = async (schemes: Scheme[]): Promise<string> => {
  const prompt = `Based on the following list of active job schemes, generate a high-level executive summary of trends, potential bottlenecks, and overall health of the project pipeline.
  Schemes: ${JSON.stringify(schemes.map(s => ({ title: s.title, status: s.status, priority: s.priority })))}`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text;
};
