import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Play, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import YouTubeVideoCard from "@/components/YouTubeVideoCard";
import { YouTubeVideoSkeleton } from "@/components/YouTubeVideoSkeleton";
import YouTubePlayerModal from "@/components/YouTubePlayerModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getChannelVideos, YouTubeVideo } from "@/services/youtubeService";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const YouTubeCreatorPage = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const { user } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<{ id: string; title: string } | null>(null);

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

  // Fetch videos from YouTube using useInfiniteQuery
  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["channel-videos", channelId],
    queryFn: async ({ pageParam }) => {
      return getChannelVideos(channelId!, pageParam);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextPageToken || undefined,
    enabled: !!channelId,
  });

  // Flatten the videos from all pages
  const videos: YouTubeVideo[] = data?.pages.flatMap((page) => page.videos) || [];

  const handlePlayVideo = (videoId: string, title: string) => {
    setSelectedVideo({ id: videoId, title });
  };

  const handleClosePlayer = () => {
    setSelectedVideo(null);
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

            </div>
          </section>
        )}

        {/* Videos Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light text-foreground">
            Latest Videos
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <YouTubeVideoSkeleton key={index} />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <YouTubeVideoCard key={video.id} video={video} onPlay={handlePlayVideo} />
                ))}
              </div>

              {hasNextPage && (
                <div className="flex justify-center pt-8">
                  <Button
                    onClick={() => fetchNextPage()}
                    disabled={isFetchingNextPage}
                    variant="outline"
                    className="border-gold/30 text-gold hover:bg-gold/10"
                  >
                    {isFetchingNextPage ? (
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

      <YouTubePlayerModal
        videoId={selectedVideo?.id || null}
        videoTitle={selectedVideo?.title}
        onClose={handleClosePlayer}
      />
    </div>
  );
};

export default YouTubeCreatorPage;
