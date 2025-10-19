import { GoogleGenAI, Type } from "@google/genai";
import { Nutrients, Mood, Workout } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const nutrientSchema = {
  type: Type.OBJECT,
  properties: {
    calories: { type: Type.NUMBER, description: "Estimated number of calories." },
    protein: { type: Type.NUMBER, description: "Estimated grams of protein." },
    carbs: { type: Type.NUMBER, description: "Estimated grams of carbohydrates." },
    fat: { type: Type.NUMBER, description: "Estimated grams of fat." },
  },
  required: ["calories", "protein", "carbs", "fat"],
};

export const analyzeMeal = async (mealDescription: string): Promise<Nutrients> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following meal description and return your best estimate for its nutritional content. Meal: "${mealDescription}". Only return the JSON object.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: nutrientSchema,
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);

    return {
        calories: parsedJson.calories ?? 0,
        protein: parsedJson.protein ?? 0,
        carbs: parsedJson.carbs ?? 0,
        fat: parsedJson.fat ?? 0,
    };
  } catch (error) {
    console.error("Error analyzing meal with Gemini:", error);
    throw new Error("Failed to analyze meal. Please check the food description and try again.");
  }
};

const moodMap: { [key in Mood]: string } = {
    1: 'Sad',
    2: 'Neutral',
    3: 'Okay',
    4: 'Good',
    5: 'Great'
};

export const getSmartSuggestion = async (
    goals: Nutrients, 
    current: Nutrients, 
    latestMealDescription?: string, 
    latestMood?: Mood,
    workouts?: Workout[],
    hydration?: { current: number, goal: number }
): Promise<string> => {
  try {
    let contextPrompt = '';
    if (latestMealDescription) {
        contextPrompt += `\n- The user's last logged meal was: "${latestMealDescription}".`;
    }
    if (latestMood) {
        contextPrompt += `\n- They also reported their mood as: "${moodMap[latestMood]}".`;
    }
    if (workouts && workouts.length > 0) {
        const workoutSummary = workouts.map(w => `${w.name} (${w.sets}x${w.reps} at ${w.weight}kg)`).join(', ');
        contextPrompt += `\n- Today's workouts include: ${workoutSummary}.`;
    }
    if (hydration) {
        contextPrompt += `\n- Hydration: ${(hydration.current / 1000).toFixed(1)}L of ${(hydration.goal / 1000).toFixed(1)}L consumed.`;
    }


     const prompt = `
      A user is tracking their nutrition, fitness, and wellbeing. Here is a summary of their day:
      Daily Goals:
      - Calories: ${goals.calories}
      - Protein: ${goals.protein}g
      - Carbs: ${goals.carbs}g
      - Fat: ${goals.fat}g

      Current Intake:
      - Calories: ${current.calories.toFixed(0)}
      - Protein: ${current.protein.toFixed(0)}g
      - Carbs: ${current.carbs.toFixed(0)}g
      - Fat: ${current.fat.toFixed(0)}g
      
      Additional Context:${contextPrompt || '\n- No other activities logged yet.'}

      Provide a single, short, encouraging, and actionable suggestion that holistically considers all the provided context.
      - If a workout was logged, suggest a relevant nutrition tip (e.g., post-workout protein) or recovery advice.
      - If hydration is low, gently remind them to drink water.
      - If their mood is low, prioritize a supportive message or a simple wellness activity.
      - Otherwise, provide a general nutrition tip to help them meet their goals.
      Speak directly to the user. Keep it under 40 words.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    return response.text;
  } catch (error) {
    console.error("Error getting smart suggestion from Gemini:", error);
    return "Could not generate a suggestion at this time.";
  }
};