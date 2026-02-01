import { useNavigate } from "react-router-dom";
import { Play, Users } from "lucide-react";
import { Creator } from "@/data/mockData";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      onClick={() => navigate(`/creator/${creator.id}`)}
      className="group cursor-pointer bg-card border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden hover:shadow-gold animate-fade-in"
    >
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <Avatar className="h-24 w-24 ring-2 ring-gold/20 group-hover:ring-gold/60 transition-all duration-500">
              <AvatarImage src={creator.avatar} alt={creator.name} className="object-cover" />
              <AvatarFallback className="bg-secondary text-foreground text-xl">
                {creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-gold/90 rounded-full p-3">
                <Play className="h-5 w-5 text-primary-foreground fill-current" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-light text-foreground group-hover:text-gold transition-colors duration-300">
              {creator.name}
            </h3>
            <Badge variant="outline" className="border-gold/30 text-gold">
              {creator.category}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {creator.description}
          </p>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2 border-t border-gold/10 w-full">
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-gold" />
              <span>{creator.subscribers}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Play className="h-4 w-4 text-gold" />
              <span>{creator.videoCount} videos</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;
