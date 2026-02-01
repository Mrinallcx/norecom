import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import YouTubeCreatorCard from "@/components/YouTubeCreatorCard";
import { categories } from "@/data/mockData";
import { searchYouTubeChannels, YouTubeChannel } from "@/services/youtubeService";
import { Loader2, Search } from "lucide-react";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [debouncedQuery, setDebouncedQuery] = useState("");

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
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

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
            Search for YouTube creators, save them to your dashboard, and access your favorites from any device.
          </p>
        </section>

        {/* Search and Filter */}
        <section className="space-y-6">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search YouTube creators..."
            />
          </div>
          
          <div className="flex justify-center">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </section>

        {/* Results Section */}
        <section>
          {!debouncedQuery || debouncedQuery.length < 2 ? (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-gold/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                Start typing to search for YouTube creators
              </p>
              <p className="text-muted-foreground text-sm mt-2">
                Enter at least 2 characters to begin searching
              </p>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-gold mb-4" />
              <p className="text-muted-foreground">Searching YouTube...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive text-lg">
                Failed to search. Please try again.
              </p>
            </div>
          ) : youtubeChannels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {youtubeChannels.map((channel) => (
                <YouTubeCreatorCard key={channel.id} channel={channel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No creators found matching "{debouncedQuery}"
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
