import { useState, useEffect, useRef } from "react";
import { SearchResult } from "@shared/schema";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  Heart,
  List,
  Music
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicPlayerProps {
  currentTrack: SearchResult | null;
  onTrackChange: (track: SearchResult | null) => void;
}

export function MusicPlayer({ currentTrack, onTrackChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(75);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = `/api/stream/${currentTrack.videoId}`;
      audioRef.current.load();
    }
  }, [currentTrack]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  if (!currentTrack) {
    return null;
  }

  return (
    <>
      <audio ref={audioRef} />
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="lg:pl-64">
          <div className="flex items-center justify-between p-4">
            {/* Current track info */}
            <div className="flex items-center space-x-4 flex-1">
              <img 
                src={currentTrack.thumbnail}
                alt="Now playing"
                className="w-14 h-14 rounded object-cover"
                data-testid="img-current-track"
              />
              <div>
                <h4 className="font-medium text-foreground" data-testid="text-current-title">
                  {currentTrack.title}
                </h4>
                <p className="text-sm text-muted-foreground" data-testid="text-current-artist">
                  {currentTrack.artist}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
                data-testid="button-like-current"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Player controls */}
            <div className="flex flex-col items-center flex-1 max-w-md">
              <div className="flex items-center space-x-4 mb-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-shuffle"
                >
                  <Shuffle className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-previous"
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
                  onClick={togglePlay}
                  data-testid="button-play-pause"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-next"
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-repeat"
                >
                  <Repeat className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Progress bar */}
              <div className="flex items-center space-x-2 w-full">
                <span className="text-xs text-muted-foreground" data-testid="text-current-time">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration || 100}
                  step={1}
                  onValueChange={handleProgressChange}
                  className="flex-1"
                  data-testid="slider-progress"
                />
                <span className="text-xs text-muted-foreground" data-testid="text-duration">
                  {formatTime(duration)}
                </span>
              </div>
            </div>
            
            {/* Volume and extras */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-queue"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground"
                data-testid="button-lyrics"
              >
                <Music className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  data-testid="button-volume"
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
                <Slider
                  value={[volume]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  className="w-20"
                  data-testid="slider-volume"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
