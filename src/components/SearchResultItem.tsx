import { Users, Play, Plus, HeartOff, Loader2 } from "lucide-react";
import { YouTubeChannel } from "@/services/youtubeService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface SearchResultItemProps {
  channel: YouTubeChannel;
  isSaved: boolean;
  isPending: boolean;
  onSave: () => void;
  onRemove: () => void;
}

const SearchResultItem = ({ 
  channel, 
  isSaved, 
  isPending, 
  onSave, 
  onRemove 
}: SearchResultItemProps) => {
  return (
    <div className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors border-b border-gold/10 last:border-b-0">
      <Avatar className="h-12 w-12 ring-2 ring-gold/20 shrink-0">
        <AvatarImage src={channel.avatar} alt={channel.name} className="object-cover" />
        <AvatarFallback className="bg-secondary text-foreground">
          {channel.name.charAt(0)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0 space-y-1">
        <h3 className="text-foreground font-medium truncate">
          {channel.name}
        </h3>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-gold" />
            {channel.subscriberCount}
          </span>
          <span className="flex items-center gap-1">
            <Play className="h-3 w-3 text-gold" />
            {channel.videoCount} videos
          </span>
        </div>
      </div>

      <Button
        variant={isSaved ? "outline" : "default"}
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          isSaved ? onRemove() : onSave();
        }}
        disabled={isPending}
        className={`shrink-0 ${isSaved 
          ? "border-gold/30 text-gold hover:bg-gold/10" 
          : "bg-gold hover:bg-gold/90 text-primary-foreground"
        }`}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isSaved ? (
          <>
            <HeartOff className="h-4 w-4 mr-1" />
            Saved
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-1" />
            Save
          </>
        )}
      </Button>
    </div>
  );
};

export default SearchResultItem;
