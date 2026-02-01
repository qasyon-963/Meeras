
import { GoogleGenAI, Type } from "@google/genai";
import { HeirsData, CalculationResponse, Language } from "../types";

export async function calculateInheritance(data: HeirsData, lang: Language): Promise<CalculationResponse> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Calculate Islamic inheritance (Sunni/Sharia) for:
    Deceased: ${data.deceasedGender}
    Estate: ${data.estateValue} ${data.currency}
    Debts: ${data.debts}
    Will: ${data.willAmount}
    
    Heirs counts:
    - Husband: ${data.hasHusband ? 1 : 0}
    - Wives: ${data.wivesCount}
    - Sons: ${data.sonsCount}
    - Daughters: ${data.daughtersCount}
    - Father: ${data.hasFather ? 1 : 0}
    - Mother: ${data.hasMother ? 1 : 0}
    - Full Brothers: ${data.fullBrothersCount}
    - Full Sisters: ${data.fullSistersCount}

    STRICT RULES FOR JSON OUTPUT:
    1. Group heirs by category. Use EXACT category names in the 'heir' field: "Sons", "Daughters", "Wives", "Husband", "Father", "Mother", "Full Brothers", "Full Sisters".
    2. For "Sons" and "Daughters", provide the TOTAL amount for the whole group.
    3. Ensure math is precise. The net estate is distributed after debts and will.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          totalEstate: { type: Type.NUMBER },
          netEstate: { type: Type.NUMBER },
          currency: { type: Type.STRING },
          shares: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                heir: { type: Type.STRING },
                shareFraction: { type: Type.STRING },
                sharePercentage: { type: Type.NUMBER },
                amount: { type: Type.NUMBER },
                reason: { type: Type.STRING },
              },
              required: ["heir", "shareFraction", "sharePercentage", "amount", "reason"]
            }
          },
          educationalNote: { type: Type.STRING },
        },
        required: ["totalEstate", "netEstate", "currency", "shares", "educationalNote"]
      },
      systemInstruction: "You are a Sharia Mawareeth expert. You return accurate grouped calculations in JSON format. Use category names like 'Sons' or 'Daughters' exactly as requested."
    },
  });

  const jsonStr = response.text?.trim() || '{}';
  return JSON.parse(jsonStr);
}
