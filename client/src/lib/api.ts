import { SearchResult, LyricsResult, StreamInfo } from "@shared/schema";

export const api = {
  async search(query: string, limit = 20): Promise<SearchResult[]> {
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    return data.results;
  },

  async getStreamUrl(videoId: string): Promise<string> {
    return `/api/stream/${videoId}`;
  },

  async getThumbnail(videoId: string): Promise<string> {
    return `/api/thumbnail/${videoId}`;
  },

  async getLyrics(videoId: string): Promise<LyricsResult | null> {
    const response = await fetch(`/api/lyrics/${videoId}`);
    if (!response.ok) return null;
    return response.json();
  },

  async getSuggestions(query: string): Promise<{ suggestions: string[], recent: string[] }> {
    const response = await fetch(`/api/suggestions?q=${encodeURIComponent(query)}`);
    if (!response.ok) return { suggestions: [], recent: [] };
    return response.json();
  },

  async getTrack(videoId: string): Promise<SearchResult | null> {
    const response = await fetch(`/api/track/${videoId}`);
    if (!response.ok) return null;
    return response.json();
  }
};
