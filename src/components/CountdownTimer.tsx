import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    // Get or set the countdown end time in localStorage
    const storageKey = "offer_countdown_end";
    let endTime = localStorage.getItem(storageKey);
    
    if (!endTime) {
      // Set countdown to 24 hours from now
      const newEndTime = new Date().getTime() + 24 * 60 * 60 * 1000;
      localStorage.setItem(storageKey, newEndTime.toString());
      endTime = newEndTime.toString();
    }

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = parseInt(endTime!) - now;

      if (difference <= 0) {
        // Reset countdown when it ends
        const newEndTime = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem(storageKey, newEndTime.toString());
        return { hours: 24, minutes: 0, seconds: 0 };
      }

      return {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, "0");

  return (
    <div className="bg-gradient-to-r from-red-600 via-pink-600 to-red-600 rounded-xl p-4 text-white animate-pulse-slow">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Clock className="w-5 h-5" />
        <span className="font-bold text-sm uppercase tracking-wider">Offer Ends In</span>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono bg-black/20 px-3 py-1 rounded-lg">
            {formatNumber(timeLeft.hours)}
          </span>
          <span className="text-xs mt-1 opacity-80">Hours</span>
        </div>
        <span className="text-2xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono bg-black/20 px-3 py-1 rounded-lg">
            {formatNumber(timeLeft.minutes)}
          </span>
          <span className="text-xs mt-1 opacity-80">Minutes</span>
        </div>
        <span className="text-2xl font-bold">:</span>
        <div className="flex flex-col items-center">
          <span className="text-3xl font-bold font-mono bg-black/20 px-3 py-1 rounded-lg">
            {formatNumber(timeLeft.seconds)}
          </span>
          <span className="text-xs mt-1 opacity-80">Seconds</span>
        </div>
      </div>
      <p className="text-center text-xs mt-3 opacity-90">
        ⚡ Don't miss out! 60% OFF won't last forever
      </p>
    </div>
  );
};

export default CountdownTimer;
