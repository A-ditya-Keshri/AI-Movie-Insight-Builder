import "./globals.css";

export const metadata = {
  title: "AI Movie Insight Builder | Sentiment Analysis & Movie Details",
  description:
    "Enter an IMDb movie ID to get detailed movie information, cast list, and AI-powered audience sentiment analysis. Built with Next.js and Google Gemini AI.",
  keywords: ["movie", "IMDb", "sentiment analysis", "AI", "movie reviews", "audience insights"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
