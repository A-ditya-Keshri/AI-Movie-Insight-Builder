import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = "models/gemini-3-flash-preview";

/**
 * POST /api/sentiment
 * Analyzes movie reviews using Google Gemini AI.
 * Returns sentiment summary, classification, and key themes.
 */
export async function POST(request) {
    try {
        if (!GEMINI_API_KEY) {
            return NextResponse.json(
                { error: "Gemini API key is not configured. Please set GEMINI_API_KEY in your environment." },
                { status: 500 }
            );
        }

        const body = await request.json();
        const { reviews, movieTitle, movieYear, imdbRating, plot, genre } = body;

        if (!movieTitle) {
            return NextResponse.json(
                { error: "Movie title is required for sentiment analysis." },
                { status: 400 }
            );
        }

        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        // Build the prompt
        let reviewsContext = "";
        if (reviews && reviews.length > 0) {
            reviewsContext = reviews
                .map((r, i) => `Review ${i + 1}: "${r.text}"`)
                .join("\n\n");
        }

        const prompt = `You are a professional film critic and sentiment analyst. Analyze the audience reception for the movie "${movieTitle}" (${movieYear || "Unknown Year"}).

Movie Details:
- Title: ${movieTitle}
- Year: ${movieYear || "N/A"}
- Genre: ${genre || "N/A"}
- IMDb Rating: ${imdbRating || "N/A"}
- Plot: ${plot || "N/A"}

${reviewsContext ? `Audience Reviews:\n${reviewsContext}` : "No direct audience reviews available. Please analyze based on the movie details, IMDb rating, and your knowledge of audience reception for this film."}

Provide your analysis in the following JSON format ONLY (no markdown, no code blocks, just raw JSON):
{
  "sentiment": "positive" or "mixed" or "negative",
  "summary": "A detailed 3-4 sentence summary of the overall audience sentiment and reception. Be specific about what audiences liked or disliked.",
  "themes": ["theme1", "theme2", "theme3", "theme4", "theme5"],
  "highlights": "One key standout aspect that most audiences agree on.",
  "confidence": "high" or "medium" or "low"
}

IMPORTANT:
- "sentiment" must be exactly one of: "positive", "mixed", or "negative"
- "themes" should be 3-5 key themes/aspects frequently mentioned or relevant
- Be honest and balanced in your assessment
- Return ONLY valid JSON, nothing else`;

        // Call Gemini (single retry for transient errors)
        let responseText;
        for (let attempt = 1; attempt <= 2; attempt++) {
            try {
                console.log(`[API] Calling ${MODEL} (attempt ${attempt})`);
                const result = await ai.models.generateContent({
                    model: MODEL,
                    contents: prompt,
                });

                if (result?.text) {
                    console.log("[API] Success");
                    responseText = result.text.trim();
                    break;
                }
                throw new Error("Empty response from model");
            } catch (error) {
                const isRetryable = attempt < 2 && (
                    error.status === 503 || error.status === 429 ||
                    error.message?.includes("503") || error.message?.includes("429") ||
                    error.message?.includes("fetch failed")
                );

                if (isRetryable) {
                    console.warn(`[API] Retryable error (${error.status || "unknown"}), retrying in 3s...`);
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    continue;
                }
                throw error;
            }
        }

        // Parse AI response - strip markdown code blocks if present
        let parsed;
        try {
            let jsonStr = responseText;
            if (jsonStr.startsWith("```")) {
                jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
            }
            parsed = JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse AI response:", responseText);
            // Provide a fallback based on IMDb rating
            const rating = parseFloat(imdbRating);
            let fallbackSentiment = "mixed";
            if (rating >= 7) fallbackSentiment = "positive";
            else if (rating < 5) fallbackSentiment = "negative";

            parsed = {
                sentiment: fallbackSentiment,
                summary: `Based on its IMDb rating of ${imdbRating || "N/A"}, "${movieTitle}" has received a generally ${fallbackSentiment} reception from audiences. The film has garnered attention for its ${genre || "unique"} elements and has developed a notable audience following since its ${movieYear || ""} release.`,
                themes: ["audience reception", "film quality", "entertainment value"],
                highlights: `The film maintains a ${imdbRating || "notable"} IMDb rating.`,
                confidence: "medium",
            };
        }

        // Validate sentiment value
        const validSentiments = ["positive", "mixed", "negative"];
        if (!validSentiments.includes(parsed.sentiment)) {
            parsed.sentiment = "mixed";
        }

        return NextResponse.json({
            sentiment: parsed.sentiment,
            summary: parsed.summary || "Analysis could not be completed.",
            themes: Array.isArray(parsed.themes) ? parsed.themes.slice(0, 6) : [],
            highlights: parsed.highlights || "",
            confidence: parsed.confidence || "medium",
            reviewsAnalyzed: reviews ? reviews.length : 0,
        });
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        let errorMessage = "Failed to analyze sentiment. Please check your Gemini API key and try again.";

        if (error.status === 503 || error.message?.includes("503")) {
            errorMessage = "Google Gemini is currently experiencing high demand. Please try again in 1-2 minutes.";
        } else if (error.status === 429 || error.message?.includes("429")) {
            errorMessage = "API Rate Limit exceeded. Please wait a moment before trying again.";
        }

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
