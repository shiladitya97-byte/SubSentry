import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

declare const process: { env: Record<string, string | undefined> };

function supabaseForUser(ctx: ToolContext) {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
      auth: { persistSession: false, autoRefreshToken: false },
    },
  );
}

export default defineTool({
  name: "create_subscription",
  title: "Create subscription",
  description:
    "Create a new subscription for the signed-in user. Cost is in the user's currency; billing_cycle is 'monthly' or 'yearly'.",
  inputSchema: {
    name: z.string().trim().min(1).describe("Service name, e.g. Netflix."),
    cost: z.number().positive().describe("Recurring cost per billing cycle."),
    billing_cycle: z.enum(["monthly", "yearly"]).describe("How often the subscription renews."),
    category: z.string().trim().min(1).describe("Category, e.g. Entertainment."),
    next_renewal_date: z
      .string()
      .describe("Next renewal date in YYYY-MM-DD format."),
    alerts_enabled: z.boolean().optional().describe("Whether renewal alerts are on."),
  },
  annotations: { readOnlyHint: false, destructiveHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const { data, error } = await supabaseForUser(ctx)
      .from("subscriptions")
      .insert({
        user_id: ctx.getUserId(),
        name: input.name,
        cost: input.cost,
        billing_cycle: input.billing_cycle,
        category: input.category,
        next_renewal_date: input.next_renewal_date,
        alerts_enabled: input.alerts_enabled ?? true,
      })
      .select()
      .single();
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: `Created subscription ${data.name} (${data.id}).` }],
      structuredContent: { subscription: data },
    };
  },
});
