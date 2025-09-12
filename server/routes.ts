import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { youtubeService } from "./services/youtube";
import { lyricsService } from "./services/lyrics";
import { insertTrackSchema, insertSearchHistorySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Search endpoint
  app.get("/api/search", async (req, res) => {
    try {
      const { q: query, limit = 20, type = 'music' } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      // First check local storage for cached results
      const localResults = await storage.searchTracks(query);
      
      // Always fetch from YouTube for fresh results
      const youtubeResults = await youtubeService.search(query, Number(limit));
      
      // Store search history
      await storage.addSearchHistory({
        query,
        timestamp: new Date().toISOString(),
        results: youtubeResults as any[]
      });

      // Cache new tracks in storage
      for (const result of youtubeResults) {
        const existingTrack = await storage.getTrackByVideoId(result.videoId);
        if (!existingTrack) {
          await storage.createTrack({
            title: result.title,
            artist: result.artist,
            duration: result.duration,
            thumbnail: result.thumbnail,
            videoId: result.videoId,
            url: result.url,
            description: result.description,
            viewCount: result.viewCount,
            publishedAt: result.publishedAt
          });
        }
      }

      res.json({
        results: youtubeResults,
        local: localResults,
        total: youtubeResults.length
      });
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Search failed' });
    }
  });

  // Stream audio endpoint
  app.get("/api/stream/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const streamInfo = await youtubeService.getStreamInfo(videoId);
      
      // Redirect to the actual stream URL
      res.redirect(streamInfo.url);
    } catch (error) {
      console.error('Streaming error:', error);
      res.status(500).json({ error: 'Failed to get stream' });
    }
  });

  // Get thumbnail endpoint
  app.get("/api/thumbnail/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      const thumbnailUrl = await youtubeService.getThumbnail(videoId);
      
      // Redirect to the thumbnail URL
      res.redirect(thumbnailUrl);
    } catch (error) {
      console.error('Thumbnail error:', error);
      res.status(500).json({ error: 'Failed to get thumbnail' });
    }
  });

  // Get lyrics endpoint
  app.get("/api/lyrics/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      if (!videoId) {
        return res.status(400).json({ error: 'Video ID is required' });
      }

      // Get track info first
      const track = await storage.getTrackByVideoId(videoId);
      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      const lyrics = await lyricsService.getLyrics(track.artist, track.title);
      
      if (!lyrics) {
        return res.status(404).json({ error: 'Lyrics not found' });
      }

      res.json(lyrics);
    } catch (error) {
      console.error('Lyrics error:', error);
      res.status(500).json({ error: 'Failed to get lyrics' });
    }
  });

  // Get search suggestions
  app.get("/api/suggestions", async (req, res) => {
    try {
      const { q: query } = req.query;
      
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Query parameter is required' });
      }

      const suggestions = await storage.getSearchSuggestions(query);
      const recentSearches = await storage.getRecentSearches(5);
      
      res.json({
        suggestions,
        recent: recentSearches.map(s => s.query)
      });
    } catch (error) {
      console.error('Suggestions error:', error);
      res.status(500).json({ error: 'Failed to get suggestions' });
    }
  });

  // Get track info
  app.get("/api/track/:videoId", async (req, res) => {
    try {
      const { videoId } = req.params;
      
      const track = await storage.getTrackByVideoId(videoId);
      if (!track) {
        return res.status(404).json({ error: 'Track not found' });
      }

      res.json(track);
    } catch (error) {
      console.error('Track error:', error);
      res.status(500).json({ error: 'Failed to get track' });
    }
  });

  // Playlist endpoints
  app.post("/api/playlists", async (req, res) => {
    try {
      const { name, description, coverImage } = req.body;
      
      const playlist = await storage.createPlaylist({
        name,
        description,
        coverImage,
        isPublic: true,
        tracks: []
      });

      res.json(playlist);
    } catch (error) {
      console.error('Create playlist error:', error);
      res.status(500).json({ error: 'Failed to create playlist' });
    }
  });

  app.get("/api/playlists/:id", async (req, res) => {
    try {
      const { id } = req.params;
      
      const playlist = await storage.getPlaylist(id);
      if (!playlist) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      res.json(playlist);
    } catch (error) {
      console.error('Get playlist error:', error);
      res.status(500).json({ error: 'Failed to get playlist' });
    }
  });

  app.post("/api/playlists/:id/tracks", async (req, res) => {
    try {
      const { id } = req.params;
      const { trackId } = req.body;
      
      const success = await storage.addTrackToPlaylist(id, trackId);
      if (!success) {
        return res.status(404).json({ error: 'Playlist not found' });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Add track to playlist error:', error);
      res.status(500).json({ error: 'Failed to add track to playlist' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
