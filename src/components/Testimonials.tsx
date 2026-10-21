import { Star, Quote, CheckCircle2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { genuineReviews } from "@/data/reviewsData";

const Testimonials = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-card/50 border-t border-border/50">
      <div className="container mx-auto px-4">
        {/* Header - SEO Optimized */}
        <motion.div
          className="text-center mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-3">
            <span>✨ 100% Verified Customer Stories</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
            Real Moments, Real Tears of Joy 💬
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto px-2">
            See how our handcrafted celebration websites helped couples and best friends turn birthdays, anniversaries, and proposals into unforgettable lifelong memories.
          </p>
        </motion.div>

        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Gradient Overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-card/80 to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-card/80 to-transparent z-10" />

          {/* Scrolling Track */}
          <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused]">
            {[...genuineReviews, ...genuineReviews].map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-80 sm:w-96 bg-card rounded-2xl p-5 sm:p-6 border border-border/80 hover:border-primary/50 shadow-sm transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar: Template Tag + Rating */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {testimonial.templateName}
                    </span>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: testimonial.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  {/* Review Text */}
                  <div className="relative mb-4">
                    <Quote className="w-5 h-5 text-primary/20 mb-2 -scale-x-100 inline-block" />
                    <p className="text-sm text-foreground/90 leading-relaxed font-normal">
                      "{testimonial.review}"
                    </p>
                  </div>
                </div>

                {/* Author Info */}
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full bg-gradient-to-tr ${testimonial.avatarColor} text-white font-bold text-xs flex items-center justify-center shadow-inner flex-shrink-0`}
                    >
                      {testimonial.avatarInitials}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-foreground">
                          {testimonial.name}
                        </span>
                        {testimonial.verified && (
                          <span className="inline-flex items-center text-[10px] text-emerald-500 font-medium" title="Verified Customer">
                            <CheckCircle2 className="w-3 h-3 fill-emerald-500/20" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MapPin className="w-2.5 h-2.5" />
                        <span>{testimonial.location}</span>
                        <span>·</span>
                        <span>{testimonial.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
