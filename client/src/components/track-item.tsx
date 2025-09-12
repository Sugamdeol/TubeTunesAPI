import { SearchResult } from "@shared/schema";
import { Play, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TrackItemProps {
  track: SearchResult;
  onPlay: () => void;
  "data-testid"?: string;
}

export function TrackItem({ track, onPlay, "data-testid": testId }: TrackItemProps) {
  return (
    <div 
      className="track-item flex items-center space-x-4 p-3 rounded-lg hover:bg-secondary/50 cursor-pointer group"
      data-testid={testId}
    >
      <img 
        src={track.thumbnail}
        alt={`${track.title} thumbnail`}
        className="w-15 h-15 rounded object-cover"
        data-testid={`img-thumbnail-${track.id}`}
      />
      <div className="flex-1">
        <h4 className="font-medium text-foreground" data-testid={`text-title-${track.id}`}>
          {track.title}
        </h4>
        <p className="text-sm text-muted-foreground" data-testid={`text-artist-${track.id}`}>
          {track.artist}
        </p>
      </div>
      <div className="text-sm text-muted-foreground" data-testid={`text-duration-${track.id}`}>
        {track.duration}
      </div>
      <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-muted-foreground hover:text-primary"
          onClick={onPlay}
          data-testid={`button-play-${track.id}`}
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-muted-foreground hover:text-accent"
          data-testid={`button-add-${track.id}`}
        >
          <Plus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="p-2 text-muted-foreground hover:text-destructive"
          data-testid={`button-like-${track.id}`}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
