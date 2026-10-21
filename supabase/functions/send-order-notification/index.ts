import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OrderNotificationRequest {
  orderId: string;
  customerName: string;
  customerEmail: string;
  productTitle: string;
  amount: number;
  currency: string;
}

const ADMIN_EMAIL = "admin@yourstore.com"; // Change this to your admin email

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderId, customerName, customerEmail, productTitle, amount, currency }: OrderNotificationRequest = await req.json();

    console.log("Sending order notification for order:", orderId);

    const formattedAmount = new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: currency || 'PKR',
      minimumFractionDigits: 0,
    }).format(amount);

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #e11d48; margin-bottom: 20px;">New Order Received! 🎉</h1>
        
        <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Order Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Order ID:</td>
              <td style="padding: 8px 0; font-weight: bold;">${orderId}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Product:</td>
              <td style="padding: 8px 0; font-weight: bold;">${productTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Amount:</td>
              <td style="padding: 8px 0; font-weight: bold; color: #16a34a;">${formattedAmount}</td>
            </tr>
          </table>
        </div>
        
        <div style="background-color: #fef3f2; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
          <h2 style="margin-top: 0; color: #333;">Customer Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #666;">Name:</td>
              <td style="padding: 8px 0; font-weight: bold;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #666;">Email:</td>
              <td style="padding: 8px 0; font-weight: bold;">${customerEmail}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; padding: 20px; background-color: #fee2e2; border-radius: 8px;">
          <p style="margin: 0; color: #991b1b; font-weight: bold;">⚡ Action Required</p>
          <p style="margin: 10px 0 0; color: #666;">Please verify the payment screenshot and fulfill this order.</p>
        </div>
        
        <p style="color: #999; font-size: 12px; margin-top: 30px; text-align: center;">
          This is an automated notification from your store.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Orders <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `🛒 New Order: ${productTitle} from ${customerName}`,
        html: emailHtml,
      }),
    });

    const emailData = await emailResponse.json();
    
    if (!emailResponse.ok) {
      console.error("Resend API error:", emailData);
      throw new Error(emailData.message || "Failed to send email");
    }

    console.log("Email sent successfully:", emailData);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending order notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
