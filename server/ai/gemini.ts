import { GoogleGenAI } from "@google/genai";

export async function generateAffiliateContent(
  apiKey: string,
  prompt: string,
  contentType: string,
  keywords: string[],
  selectedPrograms: string[]
): Promise<string> {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are an expert affiliate marketing content creator. 
Create high-converting ${contentType} content that:
- Incorporates the target keywords naturally: ${keywords.join(", ")}
- Promotes the selected affiliate programs: ${selectedPrograms.join(", ")}
- Follows SEO best practices
- Includes compelling calls-to-action
- Maintains authenticity and provides genuine value
- Is optimized for conversions

Generate complete HTML content ready for web deployment.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "system",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "user", 
          parts: [{ text: prompt }]
        }
      ],
    });

    return response.text || "Failed to generate content";
  } catch (error) {
    throw new Error(`Content generation failed: ${error}`);
  }
}

export async function optimizeForSEO(
  apiKey: string,
  content: string,
  keywords: string[]
): Promise<{
  title: string;
  metaDescription: string;
  optimizedContent: string;
}> {
  try {
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Optimize this content for SEO targeting keywords: ${keywords.join(", ")}

Content:
${content}

Return JSON with:
- title: SEO-optimized title (60 chars max)
- metaDescription: Meta description (160 chars max)  
- optimizedContent: Content with improved keyword placement and structure`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            title: { type: "string" },
            metaDescription: { type: "string" },
            optimizedContent: { type: "string" }
          },
          required: ["title", "metaDescription", "optimizedContent"]
        }
      },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const result = JSON.parse(response.text || "{}");
    return result;
  } catch (error) {
    throw new Error(`SEO optimization failed: ${error}`);
  }
}