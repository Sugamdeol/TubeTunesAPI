import { type Track, type InsertTrack, type Playlist, type InsertPlaylist, type SearchHistory, type InsertSearchHistory } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Track operations
  getTrack(id: string): Promise<Track | undefined>;
  getTrackByVideoId(videoId: string): Promise<Track | undefined>;
  createTrack(track: InsertTrack): Promise<Track>;
  searchTracks(query: string): Promise<Track[]>;
  
  // Playlist operations
  getPlaylist(id: string): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined>;
  addTrackToPlaylist(playlistId: string, trackId: string): Promise<boolean>;
  removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean>;
  
  // Search history
  addSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  getSearchSuggestions(query: string): Promise<string[]>;
  getRecentSearches(limit?: number): Promise<SearchHistory[]>;
}

export class MemStorage implements IStorage {
  private tracks: Map<string, Track>;
  private playlists: Map<string, Playlist>;
  private searchHistories: Map<string, SearchHistory>;

  constructor() {
    this.tracks = new Map();
    this.playlists = new Map();
    this.searchHistories = new Map();
  }

  async getTrack(id: string): Promise<Track | undefined> {
    return this.tracks.get(id);
  }

  async getTrackByVideoId(videoId: string): Promise<Track | undefined> {
    return Array.from(this.tracks.values()).find(track => track.videoId === videoId);
  }

  async createTrack(insertTrack: InsertTrack): Promise<Track> {
    const id = randomUUID();
    const track: Track = { 
      ...insertTrack, 
      id,
      description: insertTrack.description ?? null,
      viewCount: insertTrack.viewCount ?? null,
      publishedAt: insertTrack.publishedAt ?? null
    };
    this.tracks.set(id, track);
    return track;
  }

  async searchTracks(query: string): Promise<Track[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.tracks.values()).filter(track =>
      track.title.toLowerCase().includes(lowerQuery) ||
      track.artist.toLowerCase().includes(lowerQuery)
    );
  }

  async getPlaylist(id: string): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }

  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = randomUUID();
    const playlist: Playlist = { 
      ...insertPlaylist, 
      id,
      description: insertPlaylist.description ?? null,
      coverImage: insertPlaylist.coverImage ?? null,
      isPublic: insertPlaylist.isPublic ?? null,
      tracks: (insertPlaylist.tracks as string[]) ?? null
    };
    this.playlists.set(id, playlist);
    return playlist;
  }

  async updatePlaylist(id: string, updates: Partial<Playlist>): Promise<Playlist | undefined> {
    const playlist = this.playlists.get(id);
    if (!playlist) return undefined;
    
    const updated = { ...playlist, ...updates };
    this.playlists.set(id, updated);
    return updated;
  }

  async addTrackToPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) return false;
    
    const tracks = playlist.tracks || [];
    if (!tracks.includes(trackId)) {
      tracks.push(trackId);
      playlist.tracks = tracks;
      this.playlists.set(playlistId, playlist);
    }
    return true;
  }

  async removeTrackFromPlaylist(playlistId: string, trackId: string): Promise<boolean> {
    const playlist = this.playlists.get(playlistId);
    if (!playlist) return false;
    
    const tracks = playlist.tracks || [];
    const index = tracks.indexOf(trackId);
    if (index > -1) {
      tracks.splice(index, 1);
      playlist.tracks = tracks;
      this.playlists.set(playlistId, playlist);
    }
    return true;
  }

  async addSearchHistory(insertSearch: InsertSearchHistory): Promise<SearchHistory> {
    const id = randomUUID();
    const search: SearchHistory = { 
      ...insertSearch, 
      id,
      results: insertSearch.results ?? null
    };
    this.searchHistories.set(id, search);
    return search;
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    const lowerQuery = query.toLowerCase();
    const suggestions = new Set<string>();
    
    for (const search of Array.from(this.searchHistories.values())) {
      if (search.query.toLowerCase().includes(lowerQuery)) {
        suggestions.add(search.query);
      }
    }
    
    return Array.from(suggestions).slice(0, 5);
  }

  async getRecentSearches(limit = 10): Promise<SearchHistory[]> {
    return Array.from(this.searchHistories.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
