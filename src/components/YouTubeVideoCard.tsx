import { Play, Eye, Clock } from "lucide-react";
import { YouTubeVideo } from "@/services/youtubeService";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface YouTubeVideoCardProps {
  video: YouTubeVideo;
  onPlay: (videoId: string, title: string) => void;
}

const YouTubeVideoCard = ({ video, onPlay }: YouTubeVideoCardProps) => {
  const handleClick = () => {
    onPlay(video.id, video.title);
  };

  return (
    <Card
      onClick={handleClick}
      className="group cursor-pointer bg-card border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden hover:shadow-gold animate-fade-in"
    >
      <div className="relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={video.thumbnail}
            alt={video.title}
            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          />
        </AspectRatio>
        
        {/* Duration badge */}
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </div>
        )}

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30">
          <div className="bg-gold/90 rounded-full p-4">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>

      <CardContent className="p-4 space-y-2">
        <h3 className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-gold transition-colors duration-300">
          {video.title}
        </h3>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {video.views && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{video.views} views</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeVideoCard;
