import { supabase } from "@/integrations/supabase/client";

export interface YouTubeChannel {
  id: string;
  name: string;
  avatar: string;
  description: string;
  subscriberCount: string;
  videoCount: number;
  customUrl?: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelId: string;
  channelTitle: string;
  publishedAt: string;
  description: string;
  views?: string;
  duration?: string;
}

// In-memory cache for search results
const searchCache = new Map<string, { data: YouTubeChannel[]; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const searchYouTubeChannels = async (query: string): Promise<YouTubeChannel[]> => {
  const cacheKey = query.toLowerCase().trim();
  
  // Check cache first
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log("Using cached results for:", query);
    return cached.data;
  }

  const { data, error } = await supabase.functions.invoke("youtube-search", {
    body: { query, type: "channel" },
  });

  if (error) {
    console.error("YouTube search error:", error);
    throw new Error(error.message);
  }

  const channels = data.channels || [];
  
  // Store in cache
  searchCache.set(cacheKey, { data: channels, timestamp: Date.now() });
  
  return channels;
};

export const searchYouTubeVideos = async (query: string): Promise<YouTubeVideo[]> => {
  const { data, error } = await supabase.functions.invoke("youtube-search", {
    body: { query, type: "video" },
  });

  if (error) {
    console.error("YouTube search error:", error);
    throw new Error(error.message);
  }

  return data.videos || [];
};

export interface ChannelVideosResponse {
  videos: YouTubeVideo[];
  nextPageToken: string | null;
}

export const getChannelVideos = async (channelId: string, pageToken?: string): Promise<ChannelVideosResponse> => {
  const { data, error } = await supabase.functions.invoke("youtube-search", {
    body: { channelId, pageToken },
  });

  if (error) {
    console.error("YouTube channel videos error:", error);
    throw new Error(error.message);
  }

  return {
    videos: data.videos || [],
    nextPageToken: data.nextPageToken || null,
  };
};
