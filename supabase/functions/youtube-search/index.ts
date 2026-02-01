import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, type = "channel" } = await req.json();
    const apiKey = Deno.env.get("YOUTUBE_API_KEY");

    if (!apiKey) {
      throw new Error("YouTube API key not configured");
    }

    if (!query) {
      throw new Error("Search query is required");
    }

    // Search for channels
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=${type}&maxResults=10&key=${apiKey}`;
    
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();

    if (searchData.error) {
      throw new Error(searchData.error.message);
    }

    if (type === "channel" && searchData.items?.length > 0) {
      // Get channel details for subscriber counts
      const channelIds = searchData.items.map((item: any) => item.snippet.channelId || item.id.channelId).join(",");
      const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelIds}&key=${apiKey}`;
      
      const channelResponse = await fetch(channelUrl);
      const channelData = await channelResponse.json();

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
