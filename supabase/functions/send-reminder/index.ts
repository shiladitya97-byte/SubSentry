import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReminderRequest {
  subscriptionName: string;
  cost: number;
  renewalDate: string;
  userEmail: string;
  userName: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const { subscriptionName, cost, renewalDate, userEmail, userName }: ReminderRequest = await req.json();

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SubSentry <onboarding@resend.dev>',
        to: [userEmail],
        subject: `Reminder: ${subscriptionName} renewal approaching`,
        html: `
          <h1>Hi ${userName}!</h1>
          <p>This is a friendly reminder that your <strong>${subscriptionName}</strong> subscription is set to renew soon.</p>
          <p><strong>Renewal Date:</strong> ${new Date(renewalDate).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ₹${cost}</p>
          <p>If you wish to cancel or modify this subscription, please log in to your SubSentry dashboard.</p>
          <p>Best regards,<br>The SubSentry Team</p>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(data.message || 'Failed to send email');
    }

    console.log("Reminder email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
