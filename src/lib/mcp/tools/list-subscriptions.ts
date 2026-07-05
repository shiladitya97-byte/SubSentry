import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

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
  name: "list_subscriptions",
  title: "List subscriptions",
  description:
    "List all subscriptions for the signed-in user, including name, cost, billing cycle, category and next renewal date.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Optional category filter (e.g. Entertainment, Software)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ category }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    let query = supabase
      .from("subscriptions")
      .select("id, name, cost, billing_cycle, category, next_renewal_date, alerts_enabled")
      .eq("user_id", ctx.getUserId())
      .order("next_renewal_date", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      structuredContent: { subscriptions: data ?? [] },
    };
  },
});
