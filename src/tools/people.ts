import { z } from "zod";
import { ApolloClient, cleanDomain, stripUndefined } from "../apollo-client.js";

export const searchPeopleDef = {
  name: "search_people" as const,
  description:
    "Search for people in Apollo's database. This is FREE and does not cost credits. " +
    "Use this as the primary discovery tool. Returns name, title, company, and LinkedIn URL. " +
    "Does NOT return email/phone — use enrich_person to get contact info (costs 1 credit). " +
    "Supports filtering by title, company, location, seniority, and more. Max 10 results per page.",
  inputSchema: z.object({
    q_keywords: z
      .string()
      .optional()
      .describe("General keyword search across all fields"),
    person_titles: z
      .array(z.string())
      .optional()
      .describe("Job titles to filter by, e.g. ['CEO', 'CTO']"),
    person_not_titles: z
      .array(z.string())
      .optional()
      .describe("Job titles to exclude"),
    q_organization_domains: z
      .array(z.string())
      .optional()
      .describe(
        "Company domains to search within, e.g. ['google.com']. Will be auto-cleaned."
      ),
    organization_locations: z
      .array(z.string())
      .optional()
      .describe(
        "HQ locations of the company, e.g. ['San Francisco, CA', 'New York']"
      ),
    person_locations: z
      .array(z.string())
      .optional()
      .describe("Locations of the person, e.g. ['California, United States']"),
    person_seniorities: z
      .array(z.string())
      .optional()
      .describe(
        "Seniority levels: 'founder', 'c_suite', 'vp', 'director', 'manager', 'senior', 'entry'"
      ),
    contact_email_status: z
      .array(z.string())
      .optional()
      .describe("Email status filter: 'verified', 'guessed', 'unavailable'"),
    organization_num_employees_ranges: z
      .array(z.string())
      .optional()
      .describe("Employee count ranges, e.g. ['1,10', '11,50', '51,200']"),
    organization_ids: z
      .array(z.string())
      .optional()
      .describe("Apollo organization IDs to filter by"),
    page: z
      .number()
      .int()
      .min(1)
      .default(1)
      .describe("Page number (starts at 1)"),
    per_page: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(10)
      .describe("Results per page (max 100, default 10)"),
  }),
};

export async function searchPeople(
  client: ApolloClient,
  input: z.infer<typeof searchPeopleDef.inputSchema>
) {
  const body = stripUndefined({
    ...input,
    q_organization_domains: input.q_organization_domains?.map(cleanDomain),
  });
  return client.post("/api/v1/mixed_people/search", body);
}

export const enrichPersonDef = {
  name: "enrich_person" as const,
  description:
    "Enrich a single person to get their email, phone, and detailed profile. " +
    "COSTS 1 CREDIT per successful match. Provide as many identifying fields as possible " +
    "for best match accuracy. At minimum provide name + domain, or LinkedIn URL, or email.",
  inputSchema: z.object({
    first_name: z.string().optional().describe("Person's first name"),
    last_name: z.string().optional().describe("Person's last name"),
    name: z
      .string()
      .optional()
      .describe("Full name (use if you don't have first/last split)"),
    email: z.string().optional().describe("Known email address"),
    organization_name: z.string().optional().describe("Company name"),
    domain: z
      .string()
      .optional()
      .describe("Company domain, e.g. 'google.com'. Will be auto-cleaned."),
    linkedin_url: z
      .string()
      .optional()
      .describe("LinkedIn profile URL, e.g. 'linkedin.com/in/johndoe'"),
    reveal_personal_emails: z
      .boolean()
      .default(false)
      .describe("If true, also return personal email addresses"),
    reveal_phone_number: z
      .boolean()
      .default(false)
      .describe("If true, also return phone numbers"),
  }),
};

export async function enrichPerson(
  client: ApolloClient,
  input: z.infer<typeof enrichPersonDef.inputSchema>
) {
  const body = stripUndefined({
    ...input,
    domain: input.domain ? cleanDomain(input.domain) : undefined,
  });
  return client.post("/api/v1/people/match", body);
}

export const bulkEnrichPeopleDef = {
  name: "bulk_enrich_people" as const,
  description:
    "Enrich multiple people in a single request. COSTS 1 CREDIT PER PERSON matched. " +
    "Each detail object should contain identifying info (name, domain, email, linkedin_url). " +
    "Max 10 people per request.",
  inputSchema: z.object({
    details: z
      .array(
        z.object({
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          name: z.string().optional(),
          email: z.string().optional(),
          organization_name: z.string().optional(),
          domain: z.string().optional(),
          linkedin_url: z.string().optional(),
        })
      )
      .min(1)
      .max(10)
      .describe("Array of person details to enrich (max 10)"),
    reveal_personal_emails: z.boolean().default(false),
    reveal_phone_number: z.boolean().default(false),
  }),
};

export async function bulkEnrichPeople(
  client: ApolloClient,
  input: z.infer<typeof bulkEnrichPeopleDef.inputSchema>
) {
  const details = input.details.map((d) => ({
    ...d,
    domain: d.domain ? cleanDomain(d.domain) : undefined,
  }));
  return client.post("/api/v1/people/bulk_match", {
    details,
    reveal_personal_emails: input.reveal_personal_emails,
    reveal_phone_number: input.reveal_phone_number,
  });
}
