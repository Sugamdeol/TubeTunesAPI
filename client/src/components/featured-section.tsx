import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FeaturedSection() {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-foreground mb-6">Featured Today</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-lg p-6 glass-effect">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Featured playlist cover"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-foreground mb-2">Today's Top Hits</h3>
          <p className="text-muted-foreground mb-4">The most played songs right now</p>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            data-testid="button-play-featured"
          >
            <Play className="mr-2 h-4 w-4" />
            Play
          </Button>
        </div>
        
        <div className="bg-card rounded-lg p-6 glass-effect">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="Artist spotlight"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-foreground mb-2">Artist Spotlight</h3>
          <p className="text-muted-foreground mb-4">Discover new and trending artists</p>
          <Button 
            variant="secondary"
            className="bg-accent text-accent-foreground hover:bg-accent/90"
            data-testid="button-explore-artists"
          >
            Explore
          </Button>
        </div>
        
        <div className="bg-card rounded-lg p-6 glass-effect">
          <img 
            src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
            alt="New releases"
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold text-foreground mb-2">New Releases</h3>
          <p className="text-muted-foreground mb-4">Fresh music from your favorite artists</p>
          <Button 
            variant="secondary"
            data-testid="button-browse-releases"
          >
            Browse
          </Button>
        </div>
      </div>
    </div>
  );
}
