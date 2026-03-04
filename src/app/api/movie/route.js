import { NextResponse } from "next/server";

const OMDB_API_KEY = process.env.OMDB_API_KEY;

/**
 * GET /api/movie?id=tt0133093
 * Fetches movie details from the OMDB API using an IMDb ID.
 */
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const imdbId = searchParams.get("id");

        // Validate IMDb ID
        if (!imdbId) {
            return NextResponse.json(
                { error: "IMDb ID is required. Please provide an 'id' query parameter." },
                { status: 400 }
            );
        }

        const imdbIdPattern = /^tt\d{7,8}$/;
        if (!imdbIdPattern.test(imdbId)) {
            return NextResponse.json(
                {
                    error:
                        "Invalid IMDb ID format. It should start with 'tt' followed by 7-8 digits (e.g., tt0133093).",
                },
                { status: 400 }
            );
        }

        if (!OMDB_API_KEY) {
            return NextResponse.json(
                { error: "OMDB API key is not configured. Please set OMDB_API_KEY in your environment." },
                { status: 500 }
            );
        }

        const response = await fetch(
            `https://www.omdbapi.com/?i=${imdbId}&apikey=${OMDB_API_KEY}&plot=full`
        );

        if (!response.ok) {
            return NextResponse.json(
                { error: "Failed to fetch movie details from OMDB. Please try again later." },
                { status: 502 }
            );
        }

        const data = await response.json();

        if (data.Response === "False") {
            return NextResponse.json(
                { error: data.Error || "Movie not found. Please check the IMDb ID." },
                { status: 404 }
            );
        }

        // Transform and return clean data
        const movieData = {
            title: data.Title,
            year: data.Year,
            rated: data.Rated,
            released: data.Released,
            runtime: data.Runtime,
            genre: data.Genre,
            director: data.Director,
            writer: data.Writer,
            actors: data.Actors,
            plot: data.Plot,
            language: data.Language,
            country: data.Country,
            awards: data.Awards,
            poster: data.Poster !== "N/A" ? data.Poster : null,
            imdbRating: data.imdbRating,
            imdbVotes: data.imdbVotes,
            imdbID: data.imdbID,
            type: data.Type,
            boxOffice: data.BoxOffice,
            production: data.Production,
        };

        return NextResponse.json(movieData);
    } catch (error) {
        console.error("Error fetching movie:", error);
        return NextResponse.json(
            { error: "An unexpected error occurred. Please try again." },
            { status: 500 }
        );
    }
}
