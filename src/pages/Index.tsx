import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import SaveCreatorDialog from "@/components/SaveCreatorDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { searchYouTubeChannels, YouTubeChannel } from "@/services/youtubeService";
import { useAuth } from "@/contexts/AuthContext";
import { useSavedCreators } from "@/hooks/useSavedCreators";
import { 
  Loader2, 
  Search, 
  Users, 
  Play, 
  Heart, 
  HeartOff, 
  Trash2,
  Plus
} from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [channelToSave, setChannelToSave] = useState<YouTubeChannel | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const { savedCreators, isLoading: isLoadingSaved, removeCreator, isCreatorSaved } = useSavedCreators();

  // Debounce search query
  useMemo(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: youtubeChannels = [], isLoading, error } = useQuery({
    queryKey: ["youtube-channels", debouncedQuery],
    queryFn: () => searchYouTubeChannels(debouncedQuery),
    enabled: debouncedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  // Get unique categories from saved creators
  const categories = useMemo(() => {
    const cats = savedCreators.map((c) => c.category).filter(Boolean) as string[];
    return [...new Set(cats)];
  }, [savedCreators]);

  // Filter saved creators by category
  const filteredSavedCreators = useMemo(() => {
    if (!selectedCategory) return savedCreators;
    return savedCreators.filter((c) => c.category === selectedCategory);
  }, [savedCreators, selectedCategory]);

  const handleSaveClick = (channel: YouTubeChannel) => {
    if (!user) {
      navigate("/auth");
      return;
    }
    setChannelToSave(channel);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center space-y-4 py-8">
          <h1 className="text-4xl md:text-5xl text-gradient-gold">
            Discover Amazing Creators
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Search for YouTube creators, save them to your collection, and access your favorites from any device.
          </p>
        </section>

        {/* Search */}
        <section className="flex justify-center">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search YouTube creators..."
          />
        </section>

        {/* Search Results */}
        {debouncedQuery.length >= 2 && (
          <section className="space-y-4">
            <h2 className="text-xl font-light text-foreground">Search Results</h2>
            
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
                <p className="text-muted-foreground">Searching YouTube...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive">Failed to search. Please try again.</p>
              </div>
            ) : youtubeChannels.length > 0 ? (
              <div className="space-y-3">
                {youtubeChannels.map((channel) => {
                  const isSaved = isCreatorSaved(channel.id);
                  return (
                    <Card
                      key={channel.id}
                      className="bg-card border-gold/10 hover:border-gold/30 transition-all"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-14 w-14 ring-2 ring-gold/20">
                            <AvatarImage src={channel.avatar} alt={channel.name} className="object-cover" />
                            <AvatarFallback className="bg-secondary text-foreground">
                              {channel.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h3 className="text-foreground font-medium truncate">
                              {channel.name}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {channel.description || "No description"}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
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
                            onClick={() => isSaved ? removeCreator.mutate(channel.id) : handleSaveClick(channel)}
                            disabled={removeCreator.isPending}
                            className={isSaved 
                              ? "border-gold/30 text-gold hover:bg-gold/10" 
                              : "bg-gold hover:bg-gold/90"
                            }
                          >
                            {isSaved ? (
                              <>
                                <HeartOff className="h-4 w-4 mr-2" />
                                Saved
                              </>
                            ) : (
                              <>
                                <Heart className="h-4 w-4 mr-2" />
                                Save
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No creators found matching "{debouncedQuery}"
                </p>
              </div>
            )}
          </section>
        )}

        {/* Prompt to search */}
        {debouncedQuery.length < 2 && savedCreators.length === 0 && (
          <div className="text-center py-16">
            <Search className="h-16 w-16 text-gold/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">
              Start typing to search for YouTube creators
            </p>
            <p className="text-muted-foreground text-sm mt-2">
              Enter at least 2 characters to begin searching
            </p>
          </div>
        )}

        {/* Saved Creators Section */}
        {user && savedCreators.length > 0 && (
          <section className="space-y-6 pt-8 border-t border-gold/10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-2xl font-light text-gradient-gold">Your Saved Creators</h2>
              
              {/* Category Filter */}
              {categories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={selectedCategory === null ? "default" : "outline"}
                    className={`cursor-pointer transition-colors ${
                      selectedCategory === null
                        ? "bg-gold text-primary-foreground"
                        : "border-gold/30 text-muted-foreground hover:text-gold hover:border-gold"
                    }`}
                    onClick={() => setSelectedCategory(null)}
                  >
                    All
                  </Badge>
                  {categories.map((cat) => (
                    <Badge
                      key={cat}
                      variant={selectedCategory === cat ? "default" : "outline"}
                      className={`cursor-pointer transition-colors ${
                        selectedCategory === cat
                          ? "bg-gold text-primary-foreground"
                          : "border-gold/30 text-muted-foreground hover:text-gold hover:border-gold"
                      }`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {isLoadingSaved ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
              </div>
            ) : filteredSavedCreators.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No creators in this category
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredSavedCreators.map((creator) => (
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
          </section>
        )}

        {/* Login prompt for non-authenticated users */}
        {!user && debouncedQuery.length < 2 && (
          <section className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Sign in to save creators and sync across devices
            </p>
            <Button onClick={() => navigate("/auth")} className="bg-gold hover:bg-gold/90">
              Sign In
            </Button>
          </section>
        )}
      </main>

      {/* Save Creator Dialog */}
      <SaveCreatorDialog
        channel={channelToSave}
        existingCategories={categories}
        onClose={() => setChannelToSave(null)}
      />
    </div>
  );
};

export default Index;
