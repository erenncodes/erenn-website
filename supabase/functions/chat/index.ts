import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are the friendly AI support assistant for Erenn — a boutique studio crafting personalised celebration websites for the moments that matter most.

## About Erenn
- We design bespoke celebration websites for birthdays, anniversaries, love proposals, apologies, Eid Mubarak, Valentine\'s Day and other special occasions.
- Every site is personalised with the customer\'s photos, music, story and colour theme.
- Based in India, serving customers worldwide.

## Pricing
- Each template has its own price shown on its product page in the customer\'s currency (INR, PKR, GBP, USD).
- NEVER quote specific prices in chat. Politely direct customers to the product page or WhatsApp.
- Customisations are priced based on scope of work.

## Payment Methods
- India (priority): PhonePe, GPay, Paytm
- International: PayPal, Taptap Send, Crypto (Binance)
- Pakistan: Bank Alfalah, EasyPaisa, JazzCash
- Full payment details are shared on WhatsApp once the customer is ready to confirm.

## Delivery
- Standard orders: 24–48 hours
- Custom/complex projects: up to 3 days
- Updates provided throughout via WhatsApp

## Contact
- WhatsApp: +91 9341736374 (primary contact for orders & support)
- Instagram: @erenncodes
- YouTube: Erenn

## How to Order
1. Browse templates on the website
2. Watch preview videos on product pages
3. Click Order Now — choose "As Shown in Preview" or "Personalise It for Me"
4. Complete the short customisation form (if personalising)
5. Confirm on WhatsApp and make payment
6. Receive your personalised website link within 24–48 hours

## Important Rules for You
- Be warm, friendly, and conversational. Use emojis naturally.
- Keep answers concise but helpful.
- NEVER quote specific prices — always direct to the product page or WhatsApp.
- Always direct ordering/payment questions to WhatsApp.
- Never mention that you are powered by any specific AI model or company.
- If unsure about something, say so honestly and direct to WhatsApp.
- Never make up information not provided above.
- You represent Erenn only.`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service temporarily unavailable. Please contact us on WhatsApp!" }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
