import { z } from "zod";
import { ApolloClient, cleanDomain, stripUndefined } from "../apollo-client.js";

export const searchOrganizationsDef = {
  name: "search_organizations" as const,
  description:
    "Search for organizations/companies in Apollo's database. " +
    "COSTS 1 CREDIT PER PAGE of results. Prefer search_people (FREE) when possible. " +
    "Use this when you specifically need company-level data like revenue, tech stack, or funding info.",
  inputSchema: z.object({
    q_organization_keyword_tags: z
      .array(z.string())
      .optional()
      .describe("Industry keyword tags, e.g. ['saas', 'fintech']"),
    q_organization_name: z
      .string()
      .optional()
      .describe("Company name to search for"),
    organization_locations: z
      .array(z.string())
      .optional()
      .describe("HQ locations, e.g. ['San Francisco, CA']"),
    organization_num_employees_ranges: z
      .array(z.string())
      .optional()
      .describe("Employee count ranges, e.g. ['1,10', '51,200']"),
    organization_revenue_ranges: z
      .array(z.string())
      .optional()
      .describe(
        "Revenue ranges in USD, e.g. ['1000000,10000000'] (1M-10M)"
      ),
    q_organization_domains: z
      .array(z.string())
      .optional()
      .describe("Company domains to search, e.g. ['google.com']"),
    organization_ids: z
      .array(z.string())
      .optional()
      .describe("Specific Apollo organization IDs"),
    page: z.number().int().min(1).default(1).describe("Page number"),
    per_page: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Results per page (max 100, default 10)"),
  }),
};

export async function searchOrganizations(
  client: ApolloClient,
  input: z.infer<typeof searchOrganizationsDef.inputSchema>
) {
  const body = stripUndefined({
    ...input,
    q_organization_domains: input.q_organization_domains?.map(cleanDomain),
  });
  return client.post("/api/v1/mixed_companies/search", body);
}

export const enrichOrganizationDef = {
  name: "enrich_organization" as const,
  description:
    "Enrich a single organization by domain to get detailed company info. " +
    "COSTS 1 CREDIT. Returns company size, industry, funding, tech stack, etc.",
  inputSchema: z.object({
    domain: z
      .string()
      .describe(
        "Company domain to enrich, e.g. 'google.com'. Will be auto-cleaned."
      ),
  }),
};

export async function enrichOrganization(
  client: ApolloClient,
  input: z.infer<typeof enrichOrganizationDef.inputSchema>
) {
  return client.get("/api/v1/organizations/enrich", {
    domain: cleanDomain(input.domain),
  });
}

export const getOrganizationDef = {
  name: "get_organization" as const,
  description:
    "Get details for an organization by its Apollo ID. FREE — no credit cost. " +
    "Use this when you already have the organization ID from a previous search.",
  inputSchema: z.object({
    organization_id: z.string().describe("Apollo organization ID"),
  }),
};

export async function getOrganization(
  client: ApolloClient,
  input: z.infer<typeof getOrganizationDef.inputSchema>
) {
  return client.get(`/api/v1/organizations/${input.organization_id}`);
}

export const getOrganizationJobPostingsDef = {
  name: "get_organization_job_postings" as const,
  description:
    "Get current job postings for an organization. COSTS 1 CREDIT. " +
    "Useful for understanding hiring priorities and team growth areas.",
  inputSchema: z.object({
    organization_id: z.string().describe("Apollo organization ID"),
  }),
};

export async function getOrganizationJobPostings(
  client: ApolloClient,
  input: z.infer<typeof getOrganizationJobPostingsDef.inputSchema>
) {
  return client.get(
    `/api/v1/organizations/${input.organization_id}/job_postings`
  );
}
