import { useNavigate } from "react-router-dom";
import { Play, Users, Heart, HeartOff, Loader2 } from "lucide-react";
import { YouTubeChannel } from "@/services/youtubeService";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCreators } from "@/hooks/useSavedCreators";

interface YouTubeCreatorCardProps {
  channel: YouTubeChannel;
}

const YouTubeCreatorCard = ({ channel }: YouTubeCreatorCardProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { saveCreator, removeCreator, isCreatorSaved } = useSavedCreators();
  
  const isSaved = isCreatorSaved(channel.id);
  const isPending = saveCreator.isPending || removeCreator.isPending;

  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    if (isSaved) {
      removeCreator.mutate(channel.id);
    } else {
      saveCreator.mutate({
        channel_id: channel.id,
        channel_name: channel.name,
        channel_avatar: channel.avatar,
        subscriber_count: channel.subscriberCount,
        video_count: channel.videoCount,
        description: channel.description,
        category: null,
      });
    }
  };

  return (
    <Card className="group bg-card border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden hover:shadow-gold animate-fade-in">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-2 ring-gold/20 group-hover:ring-gold/60 transition-all duration-500">
              <AvatarImage src={channel.avatar} alt={channel.name} className="object-cover" />
              <AvatarFallback className="bg-secondary text-foreground text-xl">
                {channel.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-light text-foreground group-hover:text-gold transition-colors duration-300 line-clamp-1">
              {channel.name}
            </h3>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
            {channel.description || "No description available"}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2 border-t border-gold/10 w-full">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold" />
              <span>{channel.subscriberCount}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-gold" />
              <span>{channel.videoCount} videos</span>
            </div>
          </div>

          <Button
            variant={isSaved ? "outline" : "default"}
            size="sm"
            onClick={handleSaveToggle}
            disabled={isPending}
            className={isSaved 
              ? "border-gold/30 text-gold hover:bg-gold/10 w-full" 
              : "bg-gold hover:bg-gold/90 w-full"
            }
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSaved ? (
              <>
                <HeartOff className="h-4 w-4 mr-2" />
                Saved
              </>
            ) : (
              <>
                <Heart className="h-4 w-4 mr-2" />
                Save Creator
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default YouTubeCreatorCard;
