import { GoogleGenAI, Type } from "@google/genai";
import { ViralPackage, StrategicReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateContentIdeas(insights: StrategicReport | null): Promise<ViralPackage> {
  let insightsPromptSection = '';
  if (insights) {
    insightsPromptSection = `
    
    IMPORTANT ADDITIONAL CONTEXT FROM THE CHANNEL'S OWN DATA:
    - Top Success Pattern to Emulate: "${insights.topSuccessPattern}"
    - Core Weakness to Avoid: "${insights.coreWeakness}"

    Based on this, when you perform your search for a viral topic, you MUST prioritize topics that align with the channel's success pattern and actively avoid topics that exhibit the core weakness.
    `;
  }
  
  const prompt = `
    You are a highly innovative, viral YouTube Shorts strategist. Your goal is to maximize viewer retention and engagement using the generated content idea.

    CONTEXT:
    - Video Niche: World History and Culture.
    - Max Video Length: 30 seconds.
    - Target Audience: US Gen Z / young adults.
    ${insightsPromptSection}

    TASK STEP 1: REQUIRED. Use your Google Search tool to find and analyze the single most viral and relevant topic/event/fact in the "World History and Culture" niche on YouTube Shorts or TikTok in the last 48 hours.
    
    TASK STEP 2: Use the viral topic found in STEP 1 as the primary subject for the content package generation.

    TASK STEP 3: Generate the full YouTube upload package based on the found viral topic. Return the output as a single raw JSON object string, without any markdown formatting.

    The JSON object must have the following structure:
    {
      "viralTopic": "The single viral topic/event/fact you discovered.",
      "title": "A short, clickable title that is a question or a shocking claim (max 60 chars).",
      "description": "2-3 sentences max. The first sentence must be a strong hook/summary. Include a call-to-action to drop a comment or share.",
      "primaryHashtags": ["an", "array", "of", "4 essential, high-traffic hashtags"],
      "engagementHashtags": ["an", "array", "of", "3 viral/trending hashtags like #fyp"],
      "outline": {
        "hook": "A 1-sentence hook for the script.",
        "mainPoint": "A 1-sentence core point for the script.",
        "cta": "A 1-sentence call to action for the script."
      }
    }
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{googleSearch: {}}],
    },
  });

  const rawText = response.text;
  
  const jsonStartIndex = rawText.indexOf('{');
  const jsonEndIndex = rawText.lastIndexOf('}');

  if (jsonStartIndex === -1 || jsonEndIndex === -1 || jsonEndIndex < jsonStartIndex) {
    console.error("Could not find a valid JSON object in the response:", rawText);
    throw new Error("The response from the AI did not contain a valid JSON object.");
  }

  const jsonText = rawText.substring(jsonStartIndex, jsonEndIndex + 1);

  try {
    const viralPackage = JSON.parse(jsonText);
    return viralPackage as ViralPackage;
  } catch (e) {
    console.error("Failed to parse extracted JSON response for content ideas:", jsonText, e);
    throw new Error("The response from the AI was not valid JSON.");
  }
}

export async function generateFeedbackResponse(topic: string, comments: string): Promise<string> {
  const prompt = `
    You are a fun, witty, and engaging YouTube creator specializing in world history and culture. Your task is to write a single, concise, and conversational response to a batch of comments from one of your videos.

    Read the video topic and the comments provided. Then, craft a single reply that you can pin to the top of the comments section.

    Your response should:
    - Be friendly and appreciative.
    - Acknowledge the general sentiment or main questions from the comments.
    - Avoid being generic. Make it feel personal and fun.
    - Keep it relatively short and easy to read.

    Video Topic: "${topic}"

    User Comments:
    ---
    ${comments}
    ---

    Your response:
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });

  return response.text;
}

export async function generateStrategicPlan(
  keyMetrics: string, 
  topVideos: string, 
  worstVideos: string
): Promise<StrategicReport> {
  const prompt = `
    You are a high-level YouTube Content Strategist for the 'World History and Culture' niche. Your audience is US Gen Z/young adults. Your task is to analyze the channel's recent performance data and generate a clear, concise 30-day action plan to improve average retention and view counts.

    CONTEXT:
    - Goal: Increase average views by 25% next month.
    - Analysis Period: The last 30 days of performance data.

    TASK:
    Analyze the following three blocks of data: Key Metrics, Top 5 Videos, and Worst 5 Videos. Based on a holistic analysis of all provided data, generate a strategic report containing only these three sections:

    1.  **Top Success Pattern:** Identify and describe the single most impactful element (e.g., topic choice, specific hook style, controversial claim) that is common ONLY to the Best Performing videos.
    2.  **Core Weakness:** Identify the single biggest failure point (e.g., confusing titles, slow hooks, niche topics) common ONLY to the Worst Performing videos.
    3.  **30-Day Action Plan:** Generate a list of three (3) specific, actionable instructions or content themes for the next 30 days. These must directly leverage the 'Top Success Pattern' and eliminate the 'Core Weakness', and should also consider the overall channel Key Metrics.

    Here is the performance data:
    ---
    **KEY METRICS:**
    ${keyMetrics}
    ---
    **TOP 5 VIDEOS:**
    ${topVideos}
    ---
    **WORST 5 VIDEOS:**
    ${worstVideos}
    ---
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topSuccessPattern: {
            type: Type.STRING,
            description: "The single most impactful element common ONLY to the Best Performing videos."
          },
          coreWeakness: {
            type: Type.STRING,
            description: "The single biggest failure point common ONLY to the Worst Performing videos."
          },
          actionPlan: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of three specific, actionable instructions for the next 30 days."
          }
        },
        required: ["topSuccessPattern", "coreWeakness", "actionPlan"]
      }
    }
  });
  
  try {
    const report = JSON.parse(response.text);
    return report as StrategicReport;
  } catch (e) {
    console.error("Failed to parse JSON response for strategic plan:", response.text, e);
    throw new Error("The response from the AI was not valid JSON.");
  }
}