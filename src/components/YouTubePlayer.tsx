import { useState } from "react";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  customThumbnail?: string;
  youtubeUrl?: string;
  showExternalLink?: boolean;
}

const YouTubePlayer = ({ 
  videoId, 
  title = "Video",
  customThumbnail,
  youtubeUrl,
  showExternalLink = true
}: YouTubePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Use custom thumbnail if provided, otherwise use YouTube's
  const thumbnailUrl = customThumbnail || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  
  // Construct YouTube URL if not provided
  const externalUrl = youtubeUrl || `https://www.youtube.com/watch?v=${videoId}`;

  return (
    <div className="space-y-4">
      {isPlaying ? (
        <div className="aspect-video w-full">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            title={title}
            className="w-full h-full border-0 rounded-xl"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <div 
          className="aspect-video w-full relative cursor-pointer group overflow-hidden rounded-xl"
          onClick={() => setIsPlaying(true)}
        >
          {/* Thumbnail */}
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Fallback to YouTube thumbnail if custom fails
              const target = e.target as HTMLImageElement;
              if (customThumbnail) {
                target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              }
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-primary rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <Play className="w-7 h-7 md:w-8 md:h-8 text-primary-foreground fill-current ml-1" />
            </div>
          </div>
          
          {/* YouTube Logo */}
          <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded text-xs text-white font-medium">
            YouTube
          </div>
        </div>
      )}
      
      {/* Watch on YouTube Button */}
      {showExternalLink && (
        <Button
          variant="outline"
          className="w-full border-primary/50 hover:bg-primary/10 hover:border-primary"
          asChild
        >
          <a href={externalUrl} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Watch on YouTube
          </a>
        </Button>
      )}
    </div>
  );
};

export default YouTubePlayer;
