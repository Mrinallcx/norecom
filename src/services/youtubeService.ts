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

export const searchYouTubeChannels = async (query: string): Promise<YouTubeChannel[]> => {
  const { data, error } = await supabase.functions.invoke("youtube-search", {
    body: { query, type: "channel" },
  });

  if (error) {
    console.error("YouTube search error:", error);
    throw new Error(error.message);
  }

  return data.channels || [];
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
