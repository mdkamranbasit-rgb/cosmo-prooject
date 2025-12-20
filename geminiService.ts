
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, MindGuardResponse } from "./types";

// Initializing the GoogleGenAI client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMindGuardAnalysis = async (data: AssessmentData): Promise<MindGuardResponse> => {
  const prompt = `
    You are MindGuard, a mental wellbeing engine. Analyze the user profile and provide a structured JSON response.
    
    USER PROFILE:
    Category: ${data.category}
    Current Life Pressure: ${data.onboarding.lifePressure}
    Mood: ${data.onboarding.mood}
    Daily Stress Level (1-10): ${data.dailyCheckin.selfReportedStress}
    Today's Trigger: ${data.dailyCheckin.moodTrigger}

    RULES:
    1. MindGuard is a supportive companion, NOT a medical professional.
    2. Respond strictly in JSON.
    3. IMPORTANT: For "recommendations.videos", provide 3 VALID YouTube URLs (e.g., https://www.youtube.com/watch?v=...) that are relevant to the user's stress level (e.g., guided meditation for High stress, upbeat science/productivity for Low stress).
    4. Generate realistic 7-day stress history data.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          app_name: { type: Type.STRING },
          category: { type: Type.STRING },
          daily_checkin: {
            type: Type.OBJECT,
            properties: {
              date: { type: Type.STRING },
              self_reported_stress: { type: Type.NUMBER },
              mood_word: { type: Type.STRING },
              sleep_quality: { type: Type.STRING },
              main_trigger: { type: Type.STRING },
            },
            required: ["date", "self_reported_stress", "mood_word", "sleep_quality", "main_trigger"]
          },
          stress_analysis: {
            type: Type.OBJECT,
            properties: {
              current_score: { type: Type.NUMBER },
              stress_level: { type: Type.STRING },
              trend: { type: Type.STRING },
              primary_triggers: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["current_score", "stress_level", "trend", "primary_triggers"]
          },
          stress_graph: {
            type: Type.OBJECT,
            properties: {
              history: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    date: { type: Type.STRING },
                    stress_score: { type: Type.NUMBER },
                  }
                }
              },
              seven_day_average: { type: Type.NUMBER },
            },
            required: ["history", "seven_day_average"]
          },
          user_profile: {
            type: Type.OBJECT,
            properties: {
              emotional_state: { type: Type.STRING },
              primary_intent: { type: Type.STRING },
              coping_readiness: { type: Type.STRING },
            },
            required: ["emotional_state", "primary_intent", "coping_readiness"]
          },
          coping_suggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration_minutes: { type: Type.NUMBER },
              }
            }
          },
          calming_message: { type: Type.STRING },
          recommendations: {
            type: Type.OBJECT,
            properties: {
              videos: { type: Type.ARRAY, items: { type: Type.STRING }, description: "YouTube URLs" },
              shorts_reels: { type: Type.ARRAY, items: { type: Type.STRING } },
              shayari: { type: Type.ARRAY, items: { type: Type.STRING } },
              quotes: { type: Type.ARRAY, items: { type: Type.STRING } },
              standup: { type: Type.ARRAY, items: { type: Type.STRING } },
            }
          }
        },
        required: [
          "app_name", "category", "daily_checkin", "stress_analysis", 
          "stress_graph", "user_profile", "coping_suggestions", 
          "calming_message", "recommendations"
        ]
      },
    }
  });

  return JSON.parse(response.text || '{}');
};
