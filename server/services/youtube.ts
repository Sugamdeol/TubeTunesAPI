import { spawn } from 'child_process';
import { SearchResult, StreamInfo } from '@shared/schema';

export class YouTubeService {
  private async executeYtDlp(args: string[]): Promise<string> {
    return new Promise((resolve, reject) => {
      const ytdlp = spawn('yt-dlp', args);
      let output = '';
      let error = '';

      ytdlp.stdout.on('data', (data) => {
        output += data.toString();
      });

      ytdlp.stderr.on('data', (data) => {
        error += data.toString();
      });

      ytdlp.on('close', (code) => {
        if (code === 0) {
          resolve(output.trim());
        } else {
          reject(new Error(`yt-dlp failed with code ${code}: ${error}`));
        }
      });
    });
  }

  async search(query: string, limit = 20): Promise<SearchResult[]> {
    try {
      const args = [
        `ytsearch${limit}:${query}`,
        '--dump-json',
        '--flat-playlist',
        '--no-playlist'
      ];

      const output = await this.executeYtDlp(args);
      const lines = output.split('\n').filter(line => line.trim());
      
      const results: SearchResult[] = [];
      
      for (const line of lines) {
        try {
          const data = JSON.parse(line);
          if (data.id && data.title) {
            results.push({
              id: data.id,
              title: data.title,
              artist: data.uploader || 'Unknown Artist',
              duration: this.formatDuration(data.duration),
              thumbnail: data.thumbnail || '',
              videoId: data.id,
              url: data.webpage_url || `https://youtube.com/watch?v=${data.id}`,
              description: data.description,
              viewCount: data.view_count,
              publishedAt: data.upload_date
            });
          }
        } catch (parseError) {
          console.warn('Failed to parse yt-dlp output line:', line);
        }
      }

      return results;
    } catch (error) {
      console.error('YouTube search failed:', error);
      throw new Error('Failed to search YouTube');
    }
  }

  async getStreamInfo(videoId: string): Promise<StreamInfo> {
    try {
      const args = [
        `https://youtube.com/watch?v=${videoId}`,
        '--dump-json',
        '--format', 'bestaudio[ext=m4a]/bestaudio[ext=mp3]/bestaudio'
      ];

      const output = await this.executeYtDlp(args);
      const data = JSON.parse(output);

      return {
        url: data.url,
        format: data.ext || 'mp3',
        quality: data.abr ? `${data.abr}kbps` : 'unknown'
      };
    } catch (error) {
      console.error('Failed to get stream info:', error);
      throw new Error('Failed to get stream information');
    }
  }

  async getThumbnail(videoId: string): Promise<string> {
    try {
      const args = [
        `https://youtube.com/watch?v=${videoId}`,
        '--dump-json',
        '--no-download'
      ];

      const output = await this.executeYtDlp(args);
      const data = JSON.parse(output);

      return data.thumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } catch (error) {
      console.error('Failed to get thumbnail:', error);
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    }
  }

  private formatDuration(seconds: number): string {
    if (!seconds) return '0:00';
    
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

export const youtubeService = new YouTubeService();
