import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCreators } from "@/hooks/useSavedCreators";
import Header from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, Play, Trash2, Loader2 } from "lucide-react";

const DashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { savedCreators, isLoading, removeCreator } = useSavedCreators();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        <section className="text-center space-y-4 py-4">
          <h1 className="text-3xl md:text-4xl text-gradient-gold">Your Dashboard</h1>
          <p className="text-muted-foreground">
            Your saved creators will appear here and sync across all your devices.
          </p>
        </section>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gold" />
          </div>
        ) : savedCreators.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              You haven't saved any creators yet.
            </p>
            <Button onClick={() => navigate("/")} className="bg-gold hover:bg-gold/90">
              Discover Creators
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {savedCreators.map((creator) => (
              <Card
                key={creator.id}
                onClick={() => navigate(`/channel/${creator.channel_id}`)}
                className="group cursor-pointer bg-card border-gold/10 hover:border-gold/40 transition-all duration-500 overflow-hidden hover:shadow-gold animate-fade-in"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <Avatar className="h-24 w-24 ring-2 ring-gold/20 group-hover:ring-gold/60 transition-all duration-500">
                      <AvatarImage src={creator.channel_avatar || ""} alt={creator.channel_name} className="object-cover" />
                      <AvatarFallback className="bg-secondary text-foreground text-xl">
                        {creator.channel_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                      <h3 className="text-lg font-light text-foreground group-hover:text-gold transition-colors duration-300">
                        {creator.channel_name}
                      </h3>
                      {creator.category && (
                        <Badge variant="outline" className="border-gold/30 text-gold">
                          {creator.category}
                        </Badge>
                      )}
                    </div>

                    {creator.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {creator.description}
                      </p>
                    )}

                    <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground pt-2 border-t border-gold/10 w-full">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-gold" />
                        <span>{creator.subscriber_count || "N/A"}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Play className="h-4 w-4 text-gold" />
                        <span>{creator.video_count || 0} videos</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeCreator.mutate(creator.channel_id);
                      }}
                      disabled={removeCreator.isPending}
                      className="border-destructive/50 text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
