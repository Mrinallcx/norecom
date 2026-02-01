import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Play, ExternalLink, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import YouTubeVideoCard from "@/components/YouTubeVideoCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getChannelVideos, YouTubeVideo } from "@/services/youtubeService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const YouTubeCreatorPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { user } = useAuth();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [nextPageToken, setNextPageToken] = useState<string | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Get saved creator info from database
  const { data: creator } = useQuery({
    queryKey: ["saved-creator", channelId],
    queryFn: async () => {
      if (!user || !channelId) return null;
      const { data } = await supabase
        .from("saved_creators")
        .select("*")
        .eq("channel_id", channelId)
        .eq("user_id", user.id)
        .single();
      return data;
    },
    enabled: !!user && !!channelId,
  });

  // Fetch initial videos from YouTube
  const { isLoading } = useQuery({
    queryKey: ["channel-videos", channelId],
    queryFn: async () => {
      const result = await getChannelVideos(channelId!);
      setVideos(result.videos);
      setNextPageToken(result.nextPageToken);
      return result;
    },
    enabled: !!channelId,
  });

  const handleLoadMore = async () => {
    if (!channelId || !nextPageToken || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const result = await getChannelVideos(channelId, nextPageToken);
      setVideos((prev) => [...prev, ...result.videos]);
      setNextPageToken(result.nextPageToken);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  if (!channelId) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-light text-foreground">Channel not found</h1>
          <Link to="/dashboard">
            <Button variant="outline" className="mt-4 border-gold/30 text-gold hover:bg-gold/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Back Button */}
        <Link to="/dashboard">
          <Button variant="ghost" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Creator Header */}
        {creator && (
          <section className="flex flex-col md:flex-row items-center md:items-start gap-8 py-8 border-b border-gold/10">
            <Avatar className="h-32 w-32 ring-4 ring-gold/30 shadow-gold">
              <AvatarImage src={creator.channel_avatar || ""} alt={creator.channel_name} className="object-cover" />
              <AvatarFallback className="bg-secondary text-foreground text-3xl">
                {creator.channel_name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-light text-gradient-gold">
                  {creator.channel_name}
                </h1>
              </div>

              {creator.description && (
                <p className="text-muted-foreground max-w-2xl line-clamp-3">
                  {creator.description}
                </p>
              )}

              <div className="flex items-center justify-center md:justify-start gap-8 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-gold" />
                  <span className="text-foreground font-medium">{creator.subscriber_count || "N/A"}</span>
                  <span>subscribers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-gold" />
                  <span className="text-foreground font-medium">{creator.video_count || 0}</span>
                  <span>videos</span>
                </div>
              </div>

              <a
                href={`https://www.youtube.com/channel/${channelId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on YouTube
                </Button>
              </a>
            </div>
          </section>
        )}

        {/* Videos Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light text-foreground">
            Latest Videos
          </h2>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
              <p className="text-muted-foreground">Loading videos...</p>
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <YouTubeVideoCard key={video.id} video={video} />
                ))}
              </div>
              
              {nextPageToken && (
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    {isLoadingMore ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      "Load More Videos"
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No videos available.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default YouTubeCreatorPage;
