import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchOpportunitiesDef = {
  name: "search_opportunities" as const,
  description:
    "Search deals/opportunities in your Apollo CRM. FREE. " +
    "Returns deal name, amount, stage, close date, and associated contacts. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search across opportunities"),
    opportunity_stage_ids: z
      .array(z.string())
      .optional()
      .describe("Filter by stage IDs (use list_opportunity_stages to get IDs)"),
    owner_id: z.string().optional().describe("Filter by deal owner user ID"),
    sort_by_field: z.string().optional().describe("Field to sort by"),
    sort_ascending: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchOpportunities(
  client: ApolloClient,
  input: z.infer<typeof searchOpportunitiesDef.inputSchema>
) {
  return client.post("/api/v1/opportunities/search", stripUndefined({ ...input }));
}

export const getOpportunityDef = {
  name: "get_opportunity" as const,
  description:
    "Get a single deal/opportunity by ID. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    opportunity_id: z.string().describe("Apollo opportunity ID"),
  }),
};

export async function getOpportunity(
  client: ApolloClient,
  input: z.infer<typeof getOpportunityDef.inputSchema>
) {
  return client.get(`/api/v1/opportunities/${input.opportunity_id}`);
}

export const createOpportunityDef = {
  name: "create_opportunity" as const,
  description:
    "Create a new deal/opportunity in your Apollo CRM. FREE. " +
    "At minimum, provide a name. Optionally set amount, stage, close date. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    name: z.string().describe("Deal/opportunity name"),
    amount: z.number().optional().describe("Deal value in dollars"),
    opportunity_stage_id: z
      .string()
      .optional()
      .describe("Stage ID (use list_opportunity_stages to get IDs)"),
    owner_id: z.string().optional().describe("Owner user ID"),
    closed_date: z
      .string()
      .optional()
      .describe("Expected close date, e.g. '2026-03-15'"),
    account_id: z.string().optional().describe("Associated account/company ID"),
    contact_ids: z
      .array(z.string())
      .optional()
      .describe("Associated contact IDs"),
  }),
};

export async function createOpportunity(
  client: ApolloClient,
  input: z.infer<typeof createOpportunityDef.inputSchema>
) {
  return client.post("/api/v1/opportunities", stripUndefined({ ...input }));
}

export const updateOpportunityDef = {
  name: "update_opportunity" as const,
  description:
    "Update an existing deal/opportunity. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    opportunity_id: z.string().describe("Apollo opportunity ID"),
    name: z.string().optional(),
    amount: z.number().optional(),
    opportunity_stage_id: z.string().optional(),
    owner_id: z.string().optional(),
    closed_date: z.string().optional(),
  }),
};

export async function updateOpportunity(
  client: ApolloClient,
  input: z.infer<typeof updateOpportunityDef.inputSchema>
) {
  const { opportunity_id, ...rest } = input;
  return client.patch(
    `/api/v1/opportunities/${opportunity_id}`,
    stripUndefined(rest)
  );
}
