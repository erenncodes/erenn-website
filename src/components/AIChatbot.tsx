import { useState, useRef, useEffect, useCallback } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
const MAX_MESSAGES_PER_SESSION = 30;

const GREETING = `Hi there! 👋 I'm the Erenn AI assistant. I can answer any questions about our website templates, pricing, customization, delivery, and more!\n\nWhat would you like to know? ✨`;

const getFallbackAnswer = (query: string): string => {
  const q = query.toLowerCase();
  if (q.includes("price") || q.includes("cost") || q.includes("rate") || q.includes("how much") || q.includes("pkr") || q.includes("inr")) {
    return "Our celebration websites start from just ₹124 (up to 60% off during our limited-time sale!). Popular templates like Happy Birthday Madam (₹289), Love Proposal 2.0 (₹249), and Supportive Website (₹220) include full animation, photos, and music.";
  }
  if (q.includes("delivery") || q.includes("time") || q.includes("how long") || q.includes("urgent") || q.includes("fast") || q.includes("hours")) {
    return "Most templates are delivered within 24 to 48 hours right on WhatsApp! If you need an urgent midnight delivery, message us on WhatsApp and we will prioritize it for you ⚡";
  }
  if (q.includes("order") || q.includes("buy") || q.includes("whatsapp") || q.includes("how to")) {
    return "Ordering is super simple: 1) Click 'Explore Templates' and pick a design, 2) Click 'Order Now', and 3) Send your photos & favorite song to our WhatsApp. We take care of everything!";
  }
  if (q.includes("song") || q.includes("music") || q.includes("photo") || q.includes("custom")) {
    return "Yes, 100%! You can include your own background music (YouTube/Spotify track), personalized love letters, and your favorite photos. We customize every single detail for you.";
  }
  if (q.includes("pay") || q.includes("gpay") || q.includes("upi") || q.includes("easypaisa") || q.includes("jazzcash") || q.includes("binance") || q.includes("international")) {
    return "We accept PhonePe, GPay, Paytm, UPI (India), Bank Transfer, EasyPaisa, JazzCash (Pakistan), plus PayPal and Binance Crypto for international customers worldwide.";
  }
  return "Thanks for asking! We craft personalized celebration websites for birthdays, anniversaries, proposals, and apologies. Feel free to browse our templates or message us on WhatsApp for any custom requirements! ✨";
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: GREETING }]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Open/Close chatbot
  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage: Message = { role: "assistant", content: data.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error: any) {
      console.warn("AI edge function unavailable, using built-in assistant response:", error);
      const fallback = getFallbackAnswer(input);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          role: "assistant",
          content: fallback,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // Check message limit
  const isMessageLimitReached = messages.length >= MAX_MESSAGES_PER_SESSION;

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {/* Chatbot Window */}
      {isOpen && (
        <div className="w-80 sm:w-96 rounded-lg shadow-lg overflow-hidden bg-card border border-border">
          {/* Header */}
          <div className="px-4 py-3 bg-secondary flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <h5 className="font-semibold">Erenn AI Assistant</h5>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleChatbot}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Chat Messages */}
          <div className="p-4 h-72 sm:h-96 overflow-y-auto space-y-3">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`rounded-md px-3 py-2 text-sm max-w-[75%] sm:max-w-[60%] ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={chatBottomRef} /> {/* Scroll anchor */}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="m-3 relative">
            <Input
              type="text"
              placeholder={isMessageLimitReached ? "Message limit reached." : "Type your message..."}
              value={input}
              onChange={handleInputChange}
              disabled={isLoading || isMessageLimitReached}
              className="pr-10"
            />
            <Button
              type="submit"
              className="absolute right-1.5 top-1.5 h-8 w-8 p-0"
              variant="ghost"
              disabled={isLoading || isMessageLimitReached}
            >
              {isLoading ? <Sparkles className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      )}

      {/* Chatbot Toggle Button */}
      <Button onClick={toggleChatbot} className="rounded-full w-14 h-14 shadow-md">
        <MessageSquare className="w-6 h-6" />
        <span className="sr-only">Toggle Chatbot</span>
      </Button>
    </div>
  );
};

export default AIChatbot;
