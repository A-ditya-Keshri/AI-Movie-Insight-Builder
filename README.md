# AI Movie Insight Builder 🎬🤖

An AI-powered movie analysis tool that fetches movie details from OMDB and uses Google Gemini AI to perform audience sentiment analysis. Enter any IMDb movie ID to get a comprehensive breakdown of the movie and understand audience reception at a glance.

## ✨ Features

- **Movie Details**: Fetches poster, title, cast, rating, runtime, genre, plot, and more
- **IMDb Review Scraping**: Automatically retrieves audience reviews from IMDb
- **AI Sentiment Analysis**: Uses Google Gemini to summarize audience sentiment (positive/mixed/negative)
- **Key Themes Extraction**: Identifies recurring themes in audience reception
- **Premium UI**: Dark glassmorphism theme with smooth Framer Motion animations
- **Responsive Design**: Fully responsive layout for desktop and mobile devices
- **Input Validation**: Validates IMDb ID format with animated error feedback
- **Graceful Error Handling**: User-friendly error messages with retry functionality

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 14 (App Router)** | Full-stack React framework with server-side API routes |
| **React 19** | UI component library |
| **Framer Motion** | Animations and micro-interactions |
| **Google Gemini AI** | Sentiment analysis and review summarization |
| **Cheerio** | Server-side HTML parsing for review scraping |
| **CSS (Custom Properties)** | Glassmorphism dark theme with design tokens |
| **Jest + Testing Library** | Unit and component testing |

### Why This Stack?

- **Next.js**: Provides both frontend and backend in a single project. API routes eliminate the need for a separate Node.js server. The App Router enables modern React patterns with server components.
- **Framer Motion**: Enables premium, declarative animations that feel native and performant — crucial for a polished UX.
- **Google Gemini**: State-of-the-art language model for accurate sentiment analysis, with a generous free tier.
- **Cheerio**: Lightweight, jQuery-like HTML parser for server-side review scraping without a headless browser.
- **Vanilla CSS with Custom Properties**: Provides full design control with a maintainable token system. Avoids framework lock-in.

## 📋 Prerequisites

- **Node.js** 18.17+ installed
- **OMDB API Key** — free at [omdbapi.com/apikey.aspx](https://www.omdbapi.com/apikey.aspx)
- **Google Gemini API Key** — free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ai-movie-insight-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   ```
   OMDB_API_KEY=your_omdb_key_here
   GEMINI_API_KEY=your_gemini_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

6. **Try it out**
   Enter an IMDb ID like `tt0133093` (The Matrix) and click "Analyze"




## 📝 Assumptions

- IMDb IDs follow the format `tt` + 7-8 digits (e.g., `tt0133093`)
- OMDB free tier has a limit of 1,000 requests/day
- IMDb review scraping may be affected by changes to IMDb's HTML structure
- When reviews cannot be scraped, the AI still provides analysis based on movie metadata and its knowledge base
- The app uses Gemini's `gemini-2.0-flash` model for fast, cost-effective analysis

