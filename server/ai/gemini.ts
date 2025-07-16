import { GoogleGenerativeAI } from "@google/generative-ai";

export async function generateAffiliateContent(
  apiKey: string,
  prompt: string,
  contentType: string,
  keywords: string[],
  selectedPrograms: string[]
): Promise<string> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const systemPrompt = `You are an expert affiliate marketing content creator. 
Create high-converting ${contentType} content that:
- Incorporates the target keywords naturally: ${keywords.join(", ")}
- Promotes the selected affiliate programs: ${selectedPrograms.join(", ")}
- Follows SEO best practices
- Includes compelling calls-to-action
- Maintains authenticity and provides genuine value
- Is optimized for conversions

Generate complete HTML content ready for web deployment.

User request: ${prompt}`;

    const result = await model.generateContent(systemPrompt);
    const response = await result.response;
    return response.text() || "Failed to generate content";
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
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro",
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const prompt = `Optimize this content for SEO targeting keywords: ${keywords.join(", ")}

Content:
${content}

Return JSON with:
- title: SEO-optimized title (60 chars max)
- metaDescription: Meta description (160 chars max)  
- optimizedContent: Content with improved keyword placement and structure

Format as valid JSON object.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return parsed;
    } catch {
      // Fallback if JSON parsing fails
      return {
        title: "SEO Optimized Content",
        metaDescription: "High-quality affiliate marketing content optimized for search engines.",
        optimizedContent: content
      };
    }
  } catch (error) {
    throw new Error(`SEO optimization failed: ${error}`);
  }
}