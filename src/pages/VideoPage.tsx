import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Eye, Clock, User } from "lucide-react";
import Header from "@/components/Header";
import VideoPlayer from "@/components/VideoPlayer";
import VideoCard from "@/components/VideoCard";
import { Button } from "@/components/ui/button";
import { getVideoById, getVideosByCreatorId, getCreatorById } from "@/data/mockData";

const VideoPage = () => {
  const { id } = useParams<{ id: string }>();
  const video = getVideoById(id || "");
  const creator = video ? getCreatorById(video.creatorId) : undefined;
  const relatedVideos = video
    ? getVideosByCreatorId(video.creatorId).filter((v) => v.id !== video.id)
    : [];

  if (!video || !creator) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-light text-foreground">Video not found</h1>
          <Link to="/">
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
        <Link to={`/creator/${creator.id}`}>
          <Button variant="ghost" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {creator.name}
          </Button>
        </Link>

        {/* Video Player */}
        <section className="max-w-5xl mx-auto">
          <VideoPlayer videoUrl={video.videoUrl} poster={video.thumbnail} />
        </section>

        {/* Video Info */}
        <section className="max-w-5xl mx-auto space-y-4">
          <h1 className="text-2xl md:text-3xl font-light text-foreground">
            {video.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-gold" />
              <span>{video.views} views</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gold" />
              <span>{video.duration}</span>
            </div>
            <Link
              to={`/creator/${creator.id}`}
              className="flex items-center gap-2 hover:text-gold transition-colors"
            >
              <User className="h-5 w-5 text-gold" />
              <span>{creator.name}</span>
            </Link>
          </div>
        </section>

        {/* Related Videos */}
        {relatedVideos.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-gold/10">
            <h2 className="text-xl font-light text-foreground">
              More from {creator.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard key={relatedVideo.id} video={relatedVideo} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default VideoPage;
