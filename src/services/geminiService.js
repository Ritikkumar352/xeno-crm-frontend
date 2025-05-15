const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

// Builds a strict prompt for Gemini
const buildPrompt = (userPrompt, campaignType) => {
  return `Generate exactly 3 to 4 personalized campaign messages.

Context:
User Prompt: ${userPrompt}
Campaign Type: ${campaignType}

Rules:
- Start each message with a number (1., 2., 3., etc.)
- Do NOT include any explanation, intro, or extra text
- Only return the 3 to 4 messages
- Each message should be short, engaging, and personalized.`;
};

// Send request to Gemini API
const generateResponseWithGemini = async (prompt, campaignType) => {
  // const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const API_KEY ="AIzaSyAk2dXadtL0VdfqNRgzTGlNfrMxtWt50XM";
  

  if (!API_KEY) {
    throw new Error("VITE_GEMINI_API_KEY is not set in environment variables.");
  }

  const fullPrompt = buildPrompt(prompt, campaignType);

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: fullPrompt }],
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

  // Parse Gemini output to isolate just the numbered messages
  const messages = content
    .split(/\n?\d\.\s/)
    .filter(Boolean)
    .map((msg, i) => `${i + 1}. ${msg.trim()}`)
    .slice(0, 4);

  if (messages.length === 0) {
    throw new Error("No valid messages returned by Gemini.");
  }

  return messages;
};

// Main exported function
export const generateCampaignMessages = async (prompt, campaignType) => {
  try {
    const messages = await generateResponseWithGemini(prompt, campaignType);
    return { success: true, data: messages };
  } catch (error) {
    console.error("Error from Gemini API. Returning fallback messages:", error);
    return {
      success: true,
      data: [
        `1. Hello [Customer Name], thank you for being with us!`,
        `2. We've missed you, [Customer Name]! Here's something special just for you.`,
        `3. Come back and enjoy 10% off on your next order.`,
      ],
    };
  }
};
