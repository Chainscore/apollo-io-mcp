import { z } from "zod";
import { ApolloClient } from "../apollo-client.js";

export const listContactStagesDef = {
  name: "list_contact_stages" as const,
  description:
    "List all contact stages in your Apollo pipeline (e.g. Cold, Approaching, Replied). FREE. " +
    "Use these stage IDs when creating or filtering contacts. Undocumented endpoint.",
  inputSchema: z.object({}),
};

export async function listContactStages(
  client: ApolloClient,
  _input: z.infer<typeof listContactStagesDef.inputSchema>
) {
  return client.get("/api/v1/contact_stages");
}

export const listAccountStagesDef = {
  name: "list_account_stages" as const,
  description:
    "List all account stages in your Apollo pipeline. FREE. " +
    "Use these stage IDs when creating or filtering accounts. Undocumented endpoint.",
  inputSchema: z.object({}),
};

export async function listAccountStages(
  client: ApolloClient,
  _input: z.infer<typeof listAccountStagesDef.inputSchema>
) {
  return client.get("/api/v1/account_stages");
}

export const listOpportunityStagesDef = {
  name: "list_opportunity_stages" as const,
  description:
    "List all deal/opportunity stages in your Apollo pipeline (e.g. Lead, Qualified, Won). FREE. " +
    "Use these stage IDs when creating or filtering opportunities. Undocumented endpoint.",
  inputSchema: z.object({}),
};

export async function listOpportunityStages(
  client: ApolloClient,
  _input: z.infer<typeof listOpportunityStagesDef.inputSchema>
) {
  return client.get("/api/v1/opportunity_stages");
}
