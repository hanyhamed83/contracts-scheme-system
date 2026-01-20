
import { GoogleGenAI, Type } from "@google/genai";
import { Scheme, AISchemeAnalysis } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeScheme = async (scheme: Scheme): Promise<AISchemeAnalysis> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a senior engineering project auditor. Analyze this contract record:
    Job No: ${scheme.Job_no}
    App No: ${scheme.APPNUMBER}
    Contractor: ${scheme.Contractor_Name}
    Title: ${scheme.Title1}
    Remarks: ${scheme.contractorRemarks}
    Appraisal: ${scheme.CONTRACTORAPPRAISAL}
    Total Cost: ${scheme.totalCost}
    Current Status: ${scheme.STATUS}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: {
            type: Type.STRING,
            description: "A professional executive summary (2 sentences max)."
          },
          riskLevel: {
            type: Type.STRING,
            description: "Risk assessment: Low, Medium, or High."
          },
          recommendations: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "3 actionable steps for the supervisor."
          },
          suggestedStatus: {
            type: Type.STRING,
            description: "Suggested workflow status based on data."
          }
        },
        required: ["summary", "riskLevel", "recommendations", "suggestedStatus"]
      }
    }
  });

  const text = response.text || '{}';
  return JSON.parse(text) as AISchemeAnalysis;
};

export const generateGlobalReport = async (schemes: Scheme[]): Promise<string> => {
  const dataSubset = schemes.slice(0, 15).map(s => ({
    job: s.Job_no,
    contractor: s.Contractor_Name,
    status: s.STATUS,
    cost: s.totalCost,
    remarks: s.contractorRemarks
  }));

  const prompt = `Generate a high-level executive audit for a construction/industrial portfolio based on these records:
  ${JSON.stringify(dataSubset)}
  
  Focus on identifying high-cost outliers, contractor performance trends, and critical bottlenecks. Keep it professional and concise.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt
  });

  return response.text || 'Unable to generate audit at this time.';
};
