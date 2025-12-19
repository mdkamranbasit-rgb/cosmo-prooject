
import { GoogleGenAI, Type } from "@google/genai";
import { AssessmentData, MindGuardResponse } from "./types";

// Initializing the GoogleGenAI client with the API key from environment variables as required
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getMindGuardAnalysis = async (data: AssessmentData): Promise<MindGuardResponse> => {
  const prompt = `
    You are MindGuard, a mental wellbeing engine. Analyze the following user profile and provide a structured JSON response as specified.
    
    USER PROFILE:
    Category: ${data.category}
    
    ONBOARDING DATA:
    - Life Pressure: ${data.onboarding.lifePressure}
    - Sleep Quality: ${data.onboarding.sleepQuality}
    - Mood: ${data.onboarding.mood}
    - Motivation: ${data.onboarding.motivation}
    - Biggest Worry: ${data.onboarding.biggestWorry}
    - Energy Level: ${data.onboarding.energyLevel}
    - Work/Life Balance: ${data.onboarding.workLifeBalance}
    
    DAILY CHECK-IN:
    - Self Reported Stress (1-10): ${data.dailyCheckin.selfReportedStress}
    - Mood Trigger: ${data.dailyCheckin.moodTrigger}
    - Sleep Last Night: ${data.dailyCheckin.sleepLastNight}
    - One word for today: ${data.dailyCheckin.dayWord}

    RULES:
    1. MindGuard is a supportive companion, NOT a medical professional.
    2. Respond strictly in JSON format.
    3. Generate realistic stress history (mock data for the graph for the last 7 days).
    4. Scoring: Map 1-10 stress to 0-100, then adjust based on mood/sleep/pressure.
    5. Personalize coping suggestions and content based on stress level.
  `;

  // Use the recommended generateContent call structure with string prompt and config
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
              videos: { type: Type.ARRAY, items: { type: Type.STRING } },
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

  // accessing response.text as a property as required by guidelines
  return JSON.parse(response.text || '{}');
};
