import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

/**
 * GET /api/reviews?id=tt0133093
 * Retrieves audience reviews for a movie.
 * Attempts to scrape from IMDb, falls back to generating sample review context.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imdbId = searchParams.get("id");

        if (!imdbId) {
            return NextResponse.json(
                { error: "IMDb ID is required." },
                { status: 400 }
            );
        }

        const imdbIdPattern = /^tt\d{7,8}$/;
        if (!imdbIdPattern.test(imdbId)) {
            return NextResponse.json(
                { error: "Invalid IMDb ID format." },
                { status: 400 }
            );
        }

        let reviews = [];

        // Attempt to scrape IMDb reviews
        try {
            const url = `https://www.imdb.com/title/${imdbId}/reviews?sort=totalVotes&dir=desc&ratingFilter=0`;

            const response = await fetch(url, {
                headers: {
                    "User-Agent":
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                    "Accept-Language": "en-US,en;q=0.9",
                    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
                },
            });

            if (response.ok) {
                const html = await response.text();
                const $ = cheerio.load(html);

                // Try modern IMDb layout selectors
                $('[data-testid="review-overflow"]').each((i, el) => {
                    if (reviews.length >= 15) return false;
                    const text = $(el).text().trim();
                    if (text && text.length > 30) {
                        reviews.push({
                            text: text.substring(0, 500),
                            author: "IMDb User",
                            rating: null,
                        });
                    }
                });

                // Fallback to classic selectors
                if (reviews.length === 0) {
                    $(".text.show-more__control").each((i, el) => {
                        if (reviews.length >= 15) return false;
                        const text = $(el).text().trim();
                        if (text && text.length > 30) {
                            const ratingEl = $(el).closest(".review-container").find(".rating-other-user-rating span:first");
                            const author = $(el).closest(".review-container").find(".display-name-link a").text().trim();
                            reviews.push({
                                text: text.substring(0, 500),
                                author: author || "IMDb User",
                                rating: ratingEl.length ? ratingEl.text().trim() + "/10" : null,
                            });
                        }
                    });
                }

                // Another fallback: look for any review-like content
                if (reviews.length === 0) {
                    $(".content .text").each((i, el) => {
                        if (reviews.length >= 15) return false;
                        const text = $(el).text().trim();
                        if (text && text.length > 50) {
                            reviews.push({
                                text: text.substring(0, 500),
                                author: "IMDb User",
                                rating: null,
                            });
                        }
                    });
                }
            }
        } catch (scrapeError) {
            console.warn("Scraping failed, using fallback:", scrapeError.message);
        }

        // If scraping didn't yield results, use OMDB data to provide context
        // The AI will still be able to generate meaningful sentiment analysis
        // based on movie metadata
        const success = reviews.length > 0;

        return NextResponse.json({
            reviews,
            count: reviews.length,
            source: success ? "imdb" : "none",
            message: success
                ? `Found ${reviews.length} reviews`
                : "Could not retrieve reviews. AI will analyze based on available movie metadata.",
        });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json(
            { error: "Failed to retrieve reviews." },
            { status: 500 }
        );
    }
}
