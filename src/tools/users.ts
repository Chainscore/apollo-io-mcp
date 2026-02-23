import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchUsersDef = {
  name: "search_users" as const,
  description:
    "Search team members/users in your Apollo workspace. FREE. " +
    "Returns user IDs, names, and email addresses. " +
    "User IDs are needed for assigning tasks, deals, and contacts. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Search by name or email"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchUsers(
  client: ApolloClient,
  input: z.infer<typeof searchUsersDef.inputSchema>
) {
  return client.post("/api/v1/users/search", stripUndefined({ ...input }));
}
