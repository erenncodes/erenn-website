import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cache for exchange rates (5 minutes)
let ratesCache: { rates: Record<string, number>; timestamp: number } | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fallback rates (PKR as base)
const FALLBACK_RATES = {
  PKR: 1,
  INR: 0.30,
  USD: 0.0036,
};

async function fetchExchangeRates(): Promise<Record<string, number>> {
  // Check cache first
  if (ratesCache && Date.now() - ratesCache.timestamp < CACHE_DURATION) {
    console.log("Returning cached exchange rates");
    return ratesCache.rates;
  }

  try {
    // Using exchangerate-api.com free tier (PKR as base)
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/PKR"
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched fresh exchange rates from API");

    // Extract rates we need (PKR as base, so 1 PKR = X of target currency)
    const rates = {
      PKR: 1,
      INR: data.rates.INR || FALLBACK_RATES.INR,
      USD: data.rates.USD || FALLBACK_RATES.USD,
    };

    // Update cache
    ratesCache = { rates, timestamp: Date.now() };
    
    return rates;
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Return cached rates if available, otherwise fallback
    if (ratesCache) {
      console.log("Returning stale cached rates due to API error");
      return ratesCache.rates;
    }
    console.log("Returning fallback rates");
    return FALLBACK_RATES;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const rates = await fetchExchangeRates();
    
    return new Response(
      JSON.stringify({
        success: true,
        base: "PKR",
        rates,
        timestamp: Date.now(),
        cached: ratesCache ? Date.now() - ratesCache.timestamp < 1000 : false,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error("Error in get-exchange-rates function:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch exchange rates",
        rates: FALLBACK_RATES,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});
