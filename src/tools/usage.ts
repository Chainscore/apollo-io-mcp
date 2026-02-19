import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchNewsArticlesDef = {
  name: "search_news_articles" as const,
  description:
    "Search news articles about companies in Apollo's database. COSTS CREDITS. " +
    "Useful for finding recent news about target companies for personalized outreach.",
  inputSchema: z.object({
    q_organization_domains: z
      .array(z.string())
      .optional()
      .describe("Company domains to search news for"),
    organization_ids: z
      .array(z.string())
      .optional()
      .describe("Apollo organization IDs"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(25).default(10),
  }),
};

export async function searchNewsArticles(
  client: ApolloClient,
  input: z.infer<typeof searchNewsArticlesDef.inputSchema>
) {
  const body = stripUndefined({ ...input });
  return client.post("/api/v1/news_articles/search", body);
}

export const getApiUsageStatsDef = {
  name: "get_api_usage_stats" as const,
  description:
    "Get API usage statistics for your Apollo account. FREE. " +
    "Shows credit usage, remaining credits, and rate limit info. " +
    "Call this first to verify your API key works.",
  inputSchema: z.object({}),
};

export async function getApiUsageStats(
  client: ApolloClient,
  _input: z.infer<typeof getApiUsageStatsDef.inputSchema>
) {
  return client.post("/api/v1/usage_stats/api_usage_stats", {});
}
