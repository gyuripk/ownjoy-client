import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
      // Block AI training crawlers
      {
        userAgent: [
          "GPTBot",           // OpenAI
          "Google-Extended",  // Google AI training (separate from search)
          "anthropic-ai",     // Anthropic
          "Claude-Web",       // Anthropic
          "CCBot",            // Common Crawl (used by many AI companies)
          "cohere-ai",        // Cohere
          "PerplexityBot",    // Perplexity
          "Meta-ExternalAgent", // Meta AI
          "Diffbot",
          "Bytespider",       // TikTok/ByteDance
        ],
        disallow: "/",
      },
    ],
    sitemap: "https://ownjoy.app/sitemap.xml",
  };
}
