import { useNavigate } from "react-router-dom";
import { Play, Clock, Eye } from "lucide-react";
import { Video } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";

interface VideoCardProps {
  video: Video;
}

const VideoCard = ({ video }: VideoCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/video/${video.id}`)}
      className="group cursor-pointer bg-card border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden hover:shadow-gold animate-fade-in"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="absolute bottom-2 right-2 bg-background/90 px-2 py-1 rounded text-xs text-foreground font-medium flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {video.duration}
        </div>

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-gold rounded-full p-4 shadow-gold">
            <Play className="h-8 w-8 text-primary-foreground fill-current" />
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-light text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-2 mb-2">
          {video.title}
        </h3>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Eye className="h-4 w-4 text-gold" />
          <span>{video.views} views</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
