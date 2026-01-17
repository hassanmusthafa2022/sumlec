
const UNSPLASH_ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

export async function getUnsplashImage(query: string): Promise<string | null> {
    if (!query) return null;

    // 1. Try Unsplash API if key is present
    if (UNSPLASH_ACCESS_KEY) {
        try {
            const res = await fetch(`https://api.unsplash.com/search/photos?page=1&query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`, {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
                }
            });
            const data = await res.json();
            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular;
            }
        } catch (error) {
            console.error("Unsplash API Error:", error);
        }
    }

    // 2. Fallback: Pollinations.ai via our secure Proxy (uses API Key server-side)
    // We return the local URL which the <img> tag will load
    // The proxy handles the actual fetching with authentication
    return `/api/image?query=${encodeURIComponent(query)}`;
}
