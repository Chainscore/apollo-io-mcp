import { z } from "zod";
import { ApolloClient, cleanDomain, stripUndefined } from "../apollo-client.js";

export const createAccountDef = {
  name: "create_account" as const,
  description:
    "Create an account (company record) in your Apollo CRM. FREE. " +
    "An account represents a company you're tracking. Provide at least the name and domain.",
  inputSchema: z.object({
    name: z.string().describe("Company name"),
    domain: z
      .string()
      .optional()
      .describe("Company domain, e.g. 'google.com'. Will be auto-cleaned."),
    phone_number: z.string().optional().describe("Company phone number"),
    raw_address: z.string().optional().describe("Full company address"),
    owner_id: z
      .string()
      .optional()
      .describe("Apollo user ID of the account owner"),
  }),
};

export async function createAccount(
  client: ApolloClient,
  input: z.infer<typeof createAccountDef.inputSchema>
) {
  const body = stripUndefined({
    ...input,
    domain: input.domain ? cleanDomain(input.domain) : undefined,
  });
  return client.post("/api/v1/accounts", body);
}

export const updateAccountDef = {
  name: "update_account" as const,
  description:
    "Update an existing account in your Apollo CRM. FREE.",
  inputSchema: z.object({
    account_id: z.string().describe("Apollo account ID to update"),
    name: z.string().optional(),
    domain: z.string().optional(),
    phone_number: z.string().optional(),
    raw_address: z.string().optional(),
    owner_id: z.string().optional(),
  }),
};

export async function updateAccount(
  client: ApolloClient,
  input: z.infer<typeof updateAccountDef.inputSchema>
) {
  const { account_id, ...rest } = input;
  const body = stripUndefined({
    ...rest,
    domain: rest.domain ? cleanDomain(rest.domain) : undefined,
  });
  return client.patch(`/api/v1/accounts/${account_id}`, body);
}

export const searchAccountsDef = {
  name: "search_accounts" as const,
  description:
    "Search accounts in your Apollo CRM. FREE. " +
    "These are company records you've already saved.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search"),
    sort_by_field: z
      .string()
      .optional()
      .describe("Field to sort by, e.g. 'account_last_activity_date'"),
    sort_ascending: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchAccounts(
  client: ApolloClient,
  input: z.infer<typeof searchAccountsDef.inputSchema>
) {
  const body = stripUndefined({ ...input });
  return client.post("/api/v1/accounts/search", body);
}
