import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listSubscriptionsTool from "./tools/list-subscriptions";
import createSubscriptionTool from "./tools/create-subscription";
import deleteSubscriptionTool from "./tools/delete-subscription";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "subsentry-mcp",
  title: "SubSentry MCP",
  version: "0.1.0",
  instructions:
    "Tools for SubSentry, a subscription tracker. Use list_subscriptions to read the signed-in user's subscriptions, create_subscription to add one, and delete_subscription to remove one.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listSubscriptionsTool, createSubscriptionTool, deleteSubscriptionTool],
});
