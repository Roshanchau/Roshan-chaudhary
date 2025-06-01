export const extractImageUrlFromMd = (md: string) => {
  try {
    const urls: string[] = [];
    
    // Match markdown image syntax ![alt](url)
    const markdownRegex = /!\[.*?\]\((.*?)\)/g;
    const markdownMatches = md.matchAll(markdownRegex);
    for (const match of markdownMatches) {
      const url = match[1];
      if (url && url.trim()) {
        urls.push(url.trim());
      }
    }

    // Match HTML img tags <img src="url" ...>
    const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;
    const imgMatches = md.matchAll(imgRegex);
    for (const match of imgMatches) {
      const url = match[1];
      if (url && url.trim()) {
        urls.push(url.trim());
      }
    }

    // Remove duplicates and filter valid URLs
    return [...new Set(urls)].filter(url => 
      url && 
      url.trim() !== "" && 
      url.startsWith("http")
    );
  } catch (error) {
    console.error("Error extracting image URLs from markdown:", error);
    return [];
  }
};