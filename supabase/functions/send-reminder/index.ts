import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schema
interface ReminderRequest {
  subscriptionId: string;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const sanitizeText = (text: string, maxLength: number): string => {
  return text.replace(/[<>]/g, '').substring(0, maxLength).trim();
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing authorization header');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with auth
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration');
      return new Response(
        JSON.stringify({ error: 'Service configuration error' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get authenticated user
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Parse and validate request
    const { subscriptionId }: ReminderRequest = await req.json();

    if (!subscriptionId || typeof subscriptionId !== 'string' || subscriptionId.length > 100) {
      console.error('Invalid subscription ID format');
      return new Response(
        JSON.stringify({ error: 'Invalid request parameters' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Verify subscription belongs to authenticated user
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('name, cost, next_renewal_date, user_id')
      .eq('id', subscriptionId)
      .eq('user_id', user.id)
      .single();

    if (subError || !subscription) {
      console.error('Subscription not found or access denied:', subError?.message);
      return new Response(
        JSON.stringify({ error: 'Subscription not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get user profile for email
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('email, name')
      .eq('id', user.id)
      .single();

    if (profileError || !profile?.email) {
      console.error('User profile not found:', profileError?.message);
      return new Response(
        JSON.stringify({ error: 'User profile not found' }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate email
    if (!validateEmail(profile.email)) {
      console.error('Invalid email format in profile');
      return new Response(
        JSON.stringify({ error: 'Invalid user email' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate cost
    const cost = Number(subscription.cost);
    if (isNaN(cost) || cost < 0 || cost > 999999) {
      console.error('Invalid cost value');
      return new Response(
        JSON.stringify({ error: 'Invalid subscription data' }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Sanitize data
    const subscriptionName = sanitizeText(subscription.name, 100);
    const userName = sanitizeText(profile.name || 'there', 100);

    // Get Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      console.error('Email service not configured');
      return new Response(
        JSON.stringify({ error: 'Email service unavailable' }),
        { status: 503, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send email
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'SubSentry <onboarding@resend.dev>',
        to: [profile.email],
        subject: `Reminder: ${subscriptionName} renewal approaching`,
        html: `
          <h1>Hi ${userName}!</h1>
          <p>This is a friendly reminder that your <strong>${subscriptionName}</strong> subscription is set to renew soon.</p>
          <p><strong>Renewal Date:</strong> ${new Date(subscription.next_renewal_date).toLocaleDateString()}</p>
          <p><strong>Amount:</strong> ₹${cost.toFixed(2)}</p>
          <p>If you wish to cancel or modify this subscription, please log in to your SubSentry dashboard.</p>
          <p>Best regards,<br>The SubSentry Team</p>
        `,
      }),
    });

    const data = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error('Email service error:', data);
      return new Response(
        JSON.stringify({ error: 'Unable to send reminder' }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Reminder email sent successfully to user:", user.id);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-reminder function:", error);
    return new Response(
      JSON.stringify({ error: 'Unable to process request' }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
