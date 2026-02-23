import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchActivitiesDef = {
  name: "search_activities" as const,
  description:
    "Search activity logs in your Apollo workspace. FREE. " +
    "Returns email sends, opens, clicks, replies, calls, and other team activities. " +
    "Useful for monitoring outreach performance and team productivity. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search in activities"),
    user_id: z.string().optional().describe("Filter by user who performed the activity"),
    contact_id: z.string().optional().describe("Filter activities for a specific contact"),
    sort_by_field: z.string().optional(),
    sort_ascending: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchActivities(
  client: ApolloClient,
  input: z.infer<typeof searchActivitiesDef.inputSchema>
) {
  return client.post("/api/v1/activities/search", stripUndefined({ ...input }));
}

export const searchPhoneCallsDef = {
  name: "search_phone_calls" as const,
  description:
    "Search phone call logs in your Apollo workspace. FREE. " +
    "Returns call records, durations, and outcomes. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    user_id: z.string().optional().describe("Filter by caller user ID"),
    contact_id: z.string().optional().describe("Filter calls for a specific contact"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchPhoneCalls(
  client: ApolloClient,
  input: z.infer<typeof searchPhoneCallsDef.inputSchema>
) {
  return client.post("/api/v1/phone_calls/search", stripUndefined({ ...input }));
}
