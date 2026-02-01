import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Get all API keys (comma-separated)
function getApiKeys(): string[] {
  const keysString = Deno.env.get("YOUTUBE_API_KEY") || "";
  return keysString.split(",").map(k => k.trim()).filter(k => k.length > 0);
}

// Try fetch with automatic key rotation on quota errors
async function fetchWithRotation(url: string, keys: string[], keyIndex = 0): Promise<any> {
  if (keyIndex >= keys.length) {
    throw new Error("All API keys have exceeded their quota. Please try again later or add more API keys.");
  }

  const apiKey = keys[keyIndex];
  const fullUrl = url.includes("?") ? `${url}&key=${apiKey}` : `${url}?key=${apiKey}`;
  
  const response = await fetch(fullUrl);
  const data = await response.json();

  if (data.error?.message?.includes("quota")) {
    console.log(`Key ...${apiKey.slice(-4)} quota exceeded, trying next key (${keyIndex + 1}/${keys.length})`);
    return fetchWithRotation(url, keys, keyIndex + 1);
  }

  if (data.error) {
    throw new Error(data.error.message);
  }

  return data;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = "channel", channelId, pageToken } = await req.json();
    const keys = getApiKeys();

    if (keys.length === 0) {
      throw new Error("No YouTube API keys configured. Please add YOUTUBE_API_KEY in Supabase secrets.");
    }

    // Fetch videos by channel ID
    if (channelId) {
      const pageTokenParam = pageToken ? `&pageToken=${pageToken}` : "";
      const videosUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&type=video&order=date&maxResults=50${pageTokenParam}`;
      const videosData = await fetchWithRotation(videosUrl, keys);

      // Get video details for view counts and durations
      const videoIds = videosData.items?.map((item: any) => item.id.videoId).join(",");
      if (videoIds) {
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}`;
        const detailsData = await fetchWithRotation(detailsUrl, keys);

        // Create map with raw duration in seconds for filtering
        const detailsMap = new Map(
          detailsData.items?.map((item: any) => [item.id, {
            views: formatCount(item.statistics.viewCount),
            duration: formatDuration(item.contentDetails.duration),
            durationSeconds: parseDurationToSeconds(item.contentDetails.duration),
          }]) || []
        );

        // Filter videos longer than 5 minutes (300 seconds)
        const videos = videosData.items
          ?.map((item: any) => {
            const details = detailsMap.get(item.id.videoId) as { views: string; duration: string; durationSeconds: number } | undefined;
            return {
              id: item.id.videoId,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
              channelId: item.snippet.channelId,
              channelTitle: item.snippet.channelTitle,
              publishedAt: item.snippet.publishedAt,
              description: item.snippet.description,
              views: details?.views || "0",
              duration: details?.duration || "0:00",
              durationSeconds: details?.durationSeconds || 0,
            };
          })
          .filter((video: any) => video.durationSeconds >= 300)
          .slice(0, 12) || [];

        return new Response(JSON.stringify({ 
          videos,
          nextPageToken: videosData.nextPageToken || null,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ videos: [], nextPageToken: null }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!query) {
      throw new Error("Search query is required");
    }

    // Search for channels or videos
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=10`;
    const searchData = await fetchWithRotation(searchUrl, keys);

    if (type === "channel" && searchData.items?.length > 0) {
      // Get channel details for subscriber counts
      const channelIds = searchData.items.map((item: any) => item.snippet.channelId || item.id.channelId).join(",");
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}`;
      const channelData = await fetchWithRotation(channelUrl, keys);

      const channels = channelData.items?.map((channel: any) => ({
        id: channel.id,
        name: channel.snippet.title,
        avatar: channel.snippet.thumbnails.high?.url || channel.snippet.thumbnails.default?.url,
        description: channel.snippet.description,
        subscriberCount: formatCount(channel.statistics.subscriberCount),
        videoCount: parseInt(channel.statistics.videoCount) || 0,
        customUrl: channel.snippet.customUrl,
      })) || [];

      return new Response(JSON.stringify({ channels }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // For video search, return video results
    const videos = searchData.items?.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelId: item.snippet.channelId,
      channelTitle: item.snippet.channelTitle,
      publishedAt: item.snippet.publishedAt,
      description: item.snippet.description,
    })) || [];

    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("YouTube API error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function formatCount(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return count;
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function parseDurationToSeconds(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  
  return hours * 3600 + minutes * 60 + seconds;
}
