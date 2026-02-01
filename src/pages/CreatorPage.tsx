import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Users, Play } from "lucide-react";
import Header from "@/components/Header";
import VideoCard from "@/components/VideoCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCreatorById, getVideosByCreatorId } from "@/data/mockData";

const CreatorPage = () => {
  const { id } = useParams<{ id: string }>();
  const creator = getCreatorById(id || "");
  const videos = getVideosByCreatorId(id || "");

  if (!creator) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-16 text-center">
          <h1 className="text-2xl font-light text-foreground">Creator not found</h1>
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
        <Link to="/">
          <Button variant="ghost" className="text-muted-foreground hover:text-gold hover:bg-gold/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>

        {/* Creator Header */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 py-8 border-b border-gold/10">
          <Avatar className="h-32 w-32 ring-4 ring-gold/30 shadow-gold">
            <AvatarImage src={creator.avatar} alt={creator.name} className="object-cover" />
            <AvatarFallback className="bg-secondary text-foreground text-3xl">
              {creator.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-light text-gradient-gold">
                {creator.name}
              </h1>
              <Badge variant="outline" className="border-gold/30 text-gold">
                {creator.category}
              </Badge>
            </div>

            <p className="text-muted-foreground max-w-2xl">
              {creator.description}
            </p>

            <div className="flex items-center justify-center md:justify-start gap-8 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-gold" />
                <span className="text-foreground font-medium">{creator.subscribers}</span>
                <span>subscribers</span>
              </div>
              <div className="flex items-center gap-2">
                <Play className="h-5 w-5 text-gold" />
                <span className="text-foreground font-medium">{creator.videoCount}</span>
                <span>videos</span>
              </div>
            </div>
          </div>
        </section>

        {/* Videos Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-light text-foreground">
            Latest Videos
          </h2>

          {videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No videos available yet.</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default CreatorPage;
