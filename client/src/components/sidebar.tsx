import { Music, Home, Search, List, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
      <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <Music className="text-primary text-2xl mr-3" />
          <span className="text-xl font-bold text-foreground">StreamSync</span>
        </div>
        
        <nav className="mt-8 flex-1 px-2 space-y-1">
          <Button 
            variant="secondary" 
            className="w-full justify-start text-foreground" 
            data-testid="link-home"
          >
            <Home className="mr-3 h-4 w-4 text-primary" />
            Home
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
            data-testid="link-search"
          >
            <Search className="mr-3 h-4 w-4" />
            Search
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
            data-testid="link-library"
          >
            <List className="mr-3 h-4 w-4" />
            Your Library
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
            data-testid="link-create-playlist"
          >
            <Plus className="mr-3 h-4 w-4" />
            Create Playlist
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-secondary"
            data-testid="link-liked-songs"
          >
            <Heart className="mr-3 h-4 w-4" />
            Liked Songs
          </Button>
        </nav>
        
        <div className="mt-6 px-2">
          <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Recent Playlists
          </h3>
          <div className="mt-2 space-y-1">
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
              data-testid="link-playlist-chill"
            >
              Chill Vibes
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
              data-testid="link-playlist-workout"
            >
              Workout Mix
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground hover:text-foreground text-sm"
              data-testid="link-playlist-study"
            >
              Study Session
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
