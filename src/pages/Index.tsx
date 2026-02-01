import { useState, useMemo } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import CreatorCard from "@/components/CreatorCard";
import { creators, categories } from "@/data/mockData";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      const matchesSearch = creator.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || creator.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

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
            Explore content from the world's most talented creators. Watch, learn, and get inspired.
          </p>
        </section>

        {/* Search and Filter */}
        <section className="space-y-6">
          <div className="flex justify-center">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search creators by name..."
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

        {/* Creators Grid */}
        <section>
          {filteredCreators.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No creators found matching your search.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
