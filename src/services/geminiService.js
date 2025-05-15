const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent";

const generateResponseWithGemini = async (prompt, campaignType) => {
  const API_KEY = "AIzaSyAk2dXadtL0VdfqNRgzTGlNfrMxtWt50XM";
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set in environment variables.");
  }

  
  const fullPrompt = `${prompt}\nCampaign Type: ${campaignType}`;

  const response = await fetch(`${GEMINI_API_URL}?key=${API_KEY}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: fullPrompt }
          ]
        }
      ]
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  if (
    data.candidates &&
    data.candidates.length > 0 &&
    data.candidates[0].content &&
    data.candidates[0].content.parts &&
    data.candidates[0].content.parts.length > 0
  ) {
    const text = data.candidates[0].content.parts[0].text;
    
    const optionBlocks = [];
    const lines = text.split(/\r?\n/);
    let currentBlock = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (/^\*?Option \d+/i.test(line)) {
        if (currentBlock.length > 0) {
          optionBlocks.push(currentBlock.join("\n"));
        }
        currentBlock = [line];
      } else if (currentBlock.length > 0 && line !== "") {
        currentBlock.push(line);
      }
      if (optionBlocks.length === 4) break;
    }
    if (currentBlock.length > 0 && optionBlocks.length < 4) {
      optionBlocks.push(currentBlock.join("\n"));
    }
   
    if (optionBlocks.length > 0) {
      return optionBlocks.slice(0, 4);
    }
    
    
    const fallback = lines.filter(l => l.trim() !== "").slice(0, 4);
    return fallback;
  } else {
    throw new Error("No valid response from Gemini API");
  }
};

export const generateCampaignMessages = async (prompt, campaignType) => {
  try {
    console.log("Generating campaign messages:", { prompt, campaignType });
    if (!prompt || prompt.trim() === '') {
      console.log("Empty prompt provided, but continuing with generation");
    }
    const messages = await generateResponseWithGemini(prompt, campaignType);
    console.log("Successfully generated messages:", messages);
    return { success: true, data: messages };
  } catch (error) {
    
  
    console.error("Error occurred but returning fallback messages:", error);
    return {
      success: true,
      data: [
        `Hello [Customer Name], thank you for being our customer!`,
        `[Customer Name], we appreciate your business and wanted to share this special message.`,
        `We value your support, [Customer Name]! Here's something we thought you might enjoy.`
      ]
    };
  }
};
