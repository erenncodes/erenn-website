import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const MAX_UPLOADS_PER_HOUR = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const email = formData.get("email") as string | null;
    const userId = formData.get("userId") as string | null;
    const honeypot = formData.get("honeypot") as string | null;

    // Honeypot check - if filled, reject silently (bots fill hidden fields)
    if (honeypot) {
      console.log("Honeypot triggered - likely bot submission");
      return new Response(
        JSON.stringify({ success: true, filePath: "processed" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file presence
    if (!file) {
      console.error("No file provided");
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error("File too large:", file.size);
      return new Response(
        JSON.stringify({ error: "File too large. Maximum size is 5MB." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error("Invalid file type:", file.type);
      return new Response(
        JSON.stringify({ error: "Invalid file type. Only images are allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Determine rate limit key (user ID or sanitized email)
    const rateLimitKey = userId || (email ? email.replace(/[^a-zA-Z0-9@._-]/g, "_").substring(0, 100) : "anonymous");
    const windowStart = new Date();
    windowStart.setMinutes(0, 0, 0); // Round to current hour

    // Check rate limit using upsert
    const { data: rateData, error: rateError } = await supabase
      .from("rate_limits")
      .upsert(
        {
          scope: "payment_upload",
          key: rateLimitKey,
          window_start: windowStart.toISOString(),
          count: 1,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "scope,key,window_start",
          ignoreDuplicates: false,
        }
      )
      .select("count")
      .single();

    // If upsert created a new row, count is 1. Otherwise we need to increment.
    // Actually, upsert doesn't increment, so we need a different approach.
    // Let's use a raw increment instead.
    
    // First, try to get existing rate limit
    const { data: existingLimit } = await supabase
      .from("rate_limits")
      .select("id, count")
      .eq("scope", "payment_upload")
      .eq("key", rateLimitKey)
      .eq("window_start", windowStart.toISOString())
      .maybeSingle();

    let currentCount = 0;

    if (existingLimit) {
      // Check if already over limit
      if (existingLimit.count >= MAX_UPLOADS_PER_HOUR) {
        console.error("Rate limit exceeded for:", rateLimitKey);
        return new Response(
          JSON.stringify({ error: "Upload limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      // Increment count
      await supabase
        .from("rate_limits")
        .update({ count: existingLimit.count + 1, updated_at: new Date().toISOString() })
        .eq("id", existingLimit.id);
      
      currentCount = existingLimit.count + 1;
    } else {
      // Insert new rate limit record
      await supabase
        .from("rate_limits")
        .insert({
          scope: "payment_upload",
          key: rateLimitKey,
          window_start: windowStart.toISOString(),
          count: 1,
        });
      
      currentCount = 1;
    }

    console.log(`Rate limit for ${rateLimitKey}: ${currentCount}/${MAX_UPLOADS_PER_HOUR}`);

    // Generate file path
    const fileExt = file.name.split(".").pop() || "jpg";
    const folderName = userId || `guest/${rateLimitKey}`;
    const fileName = `${folderName}/${Date.now()}.${fileExt}`;

    // Upload file using service role (bypasses RLS)
    const arrayBuffer = await file.arrayBuffer();
    const { error: uploadError } = await supabase.storage
      .from("payment-screenshots")
      .upload(fileName, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return new Response(
        JSON.stringify({ error: "Failed to upload file" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("File uploaded successfully:", fileName);

    return new Response(
      JSON.stringify({ 
        success: true, 
        filePath: fileName,
        remaining: MAX_UPLOADS_PER_HOUR - currentCount 
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
