import axios from 'axios';
import { LyricsResult } from '@shared/schema';

export class LyricsService {
  private readonly LYRICS_API_URL = 'https://api.lyrics.ovh/v1';

  async getLyrics(artist: string, title: string): Promise<LyricsResult | null> {
    try {
      // Clean up artist and title for better matching
      const cleanArtist = this.cleanSearchTerm(artist);
      const cleanTitle = this.cleanSearchTerm(title);

      const response = await axios.get(`${this.LYRICS_API_URL}/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`, {
        timeout: 10000
      });

      if (response.data && response.data.lyrics) {
        return {
          lyrics: response.data.lyrics,
          title: title,
          artist: artist,
          source: 'lyrics.ovh'
        };
      }

      return null;
    } catch (error) {
      console.error('Failed to fetch lyrics:', error);
      
      // Try alternative API as fallback
      return await this.getLyricsFromAlternativeAPI(artist, title);
    }
  }

  private async getLyricsFromAlternativeAPI(artist: string, title: string): Promise<LyricsResult | null> {
    try {
      // Using a free lyrics API as fallback
      const cleanArtist = this.cleanSearchTerm(artist);
      const cleanTitle = this.cleanSearchTerm(title);
      
      const response = await axios.get(`https://api.lyrist.vercel.app/api/${encodeURIComponent(cleanArtist)}/${encodeURIComponent(cleanTitle)}`, {
        timeout: 10000
      });

      if (response.data && response.data.lyrics) {
        return {
          lyrics: response.data.lyrics,
          title: title,
          artist: artist,
          source: 'lyrist.vercel.app'
        };
      }

      return null;
    } catch (error) {
      console.error('Alternative lyrics API also failed:', error);
      return null;
    }
  }

  private cleanSearchTerm(term: string): string {
    return term
      .replace(/\([^)]*\)/g, '') // Remove content in parentheses
      .replace(/\[[^\]]*\]/g, '') // Remove content in brackets
      .replace(/feat\.|ft\.|featuring/gi, '') // Remove featuring
      .replace(/official|video|audio|lyrics/gi, '') // Remove common video terms
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  async searchLyrics(query: string): Promise<LyricsResult[]> {
    // This would typically search multiple sources
    // For now, we'll return empty array as this requires more complex implementation
    return [];
  }
}

export const lyricsService = new LyricsService();
