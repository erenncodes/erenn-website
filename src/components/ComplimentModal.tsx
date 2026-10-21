import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComplimentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const compliments = [
  "You're the most beautiful soul I've ever known 💕",
  "Your smile lights up my entire world ✨",
  "Every moment with you is pure magic 🌟",
  "You make my heart skip a beat every single day 💗",
  "You're my favorite notification 📱💕",
  "Your laugh is my favorite sound in the universe 🎵",
  "You're not just beautiful, you're breathtaking 💫",
  "I fall in love with you more every day 💘",
];

const ComplimentModal = ({ isOpen, onClose }: ComplimentModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-md bg-secondary rounded-3xl p-8 shadow-2xl border border-primary/20"
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="w-8 h-8 text-primary" fill="currentColor" />
              </motion.div>
              <h2 className="font-script text-3xl text-primary">
                For My Kinza Baby Janm
              </h2>
            </div>

            {/* Compliments */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {compliments.map((compliment, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-primary/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-foreground text-sm leading-relaxed">
                    {compliment}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-6 text-center">
              <p className="text-muted-foreground text-sm mb-4">
                You deserve all the love in the world 💕
              </p>
              <Button
                onClick={onClose}
                className="bg-primary hover:bg-rose-deep text-primary-foreground px-8 py-2 rounded-full font-medium pulse-glow"
              >
                <Heart className="w-4 h-4 mr-2" fill="currentColor" />
                I Love You Too
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ComplimentModal;