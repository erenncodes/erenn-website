import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import YouTubePlayer from "@/components/YouTubePlayer";
import { extractYouTubeVideoId } from "@/lib/productThumbnails";

interface ProductMediaCarouselProps {
  imageUrl: string;
  youtubeUrl: string;
  title: string;
}

const ProductMediaCarousel = ({ imageUrl, youtubeUrl, title }: ProductMediaCarouselProps) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const videoId = extractYouTubeVideoId(youtubeUrl);

  const slides = [
    { type: "image" as const, label: "Preview" },
    ...(videoId ? [{ type: "video" as const, label: "Video" }] : []),
  ];

  const goTo = (index: number) => {
    setActiveSlide(Math.max(0, Math.min(index, slides.length - 1)));
  };

  return (
    <div className="space-y-3">
      {/* Main Slide */}
      <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-xl shadow-primary/5 relative group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {slides[activeSlide]?.type === "image" ? (
              <div className="aspect-video">
                <img
                  src={imageUrl || "/images/default-thumbnail.png"}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <YouTubePlayer
                videoId={videoId || ""}
                title={title}
                customThumbnail={imageUrl}
                youtubeUrl={youtubeUrl}
                showExternalLink={true}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {slides.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeSlide - 1)}
              disabled={activeSlide === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronLeft className="w-5 h-5 text-foreground" />
            </button>
            <button
              onClick={() => goTo(activeSlide + 1)}
              disabled={activeSlide === slides.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
            >
              <ChevronRight className="w-5 h-5 text-foreground" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {slides.length > 1 && (
        <div className="flex gap-2">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`flex-1 rounded-xl overflow-hidden border-2 transition-all ${
                activeSlide === i
                  ? "border-primary shadow-md shadow-primary/20"
                  : "border-border opacity-60 hover:opacity-100"
              }`}
            >
              {slide.type === "image" ? (
                <div className="aspect-video">
                  <img
                    src={imageUrl || "/images/default-thumbnail.png"}
                    alt={`${title} preview`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-video bg-muted flex items-center justify-center relative">
                  <img
                    src={imageUrl || "/images/default-thumbnail.png"}
                    alt={`${title} video`}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-primary/90 flex items-center justify-center">
                      <div className="w-0 h-0 border-l-[6px] border-l-primary-foreground border-t-[4px] border-t-transparent border-b-[4px] border-b-transparent ml-0.5" />
                    </div>
                  </div>
                </div>
              )}
              <div className="py-1.5 text-center">
                <span className="text-xs font-medium text-foreground">{slide.label}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductMediaCarousel;
