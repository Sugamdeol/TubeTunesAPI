import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import { MusicPlayer } from "@/components/music-player";
import { FeaturedSection } from "@/components/featured-section";
import { TrackItem } from "@/components/track-item";
import { useQuery } from "@tanstack/react-query";
import { SearchResult } from "@shared/schema";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [currentTrack, setCurrentTrack] = useState<SearchResult | null>(null);

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ['/api/search', searchQuery],
    enabled: !!searchQuery,
    queryFn: async ({ queryKey }) => {
      const [, query] = queryKey;
      const response = await fetch(`/api/search?q=${encodeURIComponent(query as string)}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      return data.results as SearchResult[];
    }
  });

  const handlePlayTrack = (track: SearchResult) => {
    setCurrentTrack(track);
  };

  const filters = ["All", "Songs", "Artists", "Albums"];

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      
      <div className="lg:pl-64 flex flex-col flex-1">
        {/* Top Bar */}
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-card border-b border-border">
          <div className="flex-1 px-4 flex justify-between items-center">
            <SearchBar 
              value={searchQuery}
              onChange={setSearchQuery}
              data-testid="search-input"
            />
            
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="button-notifications"
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-medium text-sm" data-testid="text-user-initials">
                  JD
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto pb-24">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {!searchQuery ? (
                <FeaturedSection />
              ) : (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Search Results
                    </h2>
                    <div className="flex space-x-2">
                      {filters.map((filter) => (
                        <Button
                          key={filter}
                          variant={activeFilter === filter ? "default" : "secondary"}
                          size="sm"
                          onClick={() => setActiveFilter(filter)}
                          data-testid={`button-filter-${filter.toLowerCase()}`}
                        >
                          {filter}
                        </Button>
                      ))}
                    </div>
                  </div>
                  
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-3 rounded-lg bg-secondary/50 animate-pulse">
                          <div className="w-15 h-15 bg-muted rounded"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-muted rounded w-1/2"></div>
                          </div>
                          <div className="h-3 bg-muted rounded w-12"></div>
                        </div>
                      ))}
                    </div>
                  ) : searchResults && searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((result) => (
                        <TrackItem
                          key={result.id}
                          track={result}
                          onPlay={() => handlePlayTrack(result)}
                          data-testid={`track-item-${result.id}`}
                        />
                      ))}
                    </div>
                  ) : searchQuery ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No results found for "{searchQuery}"</p>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <MusicPlayer 
        currentTrack={currentTrack}
        onTrackChange={setCurrentTrack}
      />
    </div>
  );
}
