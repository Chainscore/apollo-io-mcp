import { z } from "zod";
import { ApolloClient, cleanDomain, stripUndefined } from "../apollo-client.js";

export const createContactDef = {
  name: "create_contact" as const,
  description:
    "Create a new contact in your Apollo CRM. FREE. " +
    "Deduplication is enforced (run_dedupe=true) to prevent duplicates. " +
    "Provide at least first_name, last_name, and either email or organization_name.",
  inputSchema: z.object({
    first_name: z.string().describe("Contact's first name"),
    last_name: z.string().describe("Contact's last name"),
    email: z.string().optional().describe("Contact's email address"),
    title: z.string().optional().describe("Job title"),
    organization_name: z.string().optional().describe("Company name"),
    website_url: z.string().optional().describe("Company website URL"),
    account_id: z
      .string()
      .optional()
      .describe("Apollo account ID to associate with"),
    phone_numbers: z
      .array(
        z.object({
          raw_number: z.string(),
          type: z
            .enum(["work", "mobile", "home", "other"])
            .default("work"),
        })
      )
      .optional()
      .describe("Phone numbers to add"),
    label_names: z
      .array(z.string())
      .optional()
      .describe("Labels/tags to apply"),
    present_raw_address: z
      .string()
      .optional()
      .describe("Full address string"),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }),
};

export async function createContact(
  client: ApolloClient,
  input: z.infer<typeof createContactDef.inputSchema>
) {
  const body = stripUndefined({
    ...input,
    run_dedupe: true,
  });
  return client.post("/api/v1/contacts", body);
}

export const updateContactDef = {
  name: "update_contact" as const,
  description:
    "Update an existing contact in your Apollo CRM. FREE. " +
    "Provide the contact ID and any fields to update.",
  inputSchema: z.object({
    contact_id: z.string().describe("Apollo contact ID to update"),
    first_name: z.string().optional(),
    last_name: z.string().optional(),
    email: z.string().optional(),
    title: z.string().optional(),
    organization_name: z.string().optional(),
    website_url: z.string().optional(),
    account_id: z.string().optional(),
    phone_numbers: z
      .array(
        z.object({
          raw_number: z.string(),
          type: z
            .enum(["work", "mobile", "home", "other"])
            .default("work"),
        })
      )
      .optional(),
    label_names: z.array(z.string()).optional(),
    present_raw_address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    country: z.string().optional(),
    postal_code: z.string().optional(),
  }),
};

export async function updateContact(
  client: ApolloClient,
  input: z.infer<typeof updateContactDef.inputSchema>
) {
  const { contact_id, ...rest } = input;
  const body = stripUndefined(rest);
  return client.patch(`/api/v1/contacts/${contact_id}`, body);
}

export const getContactDef = {
  name: "get_contact" as const,
  description:
    "Get a single contact by ID from your Apollo CRM. FREE.",
  inputSchema: z.object({
    contact_id: z.string().describe("Apollo contact ID"),
  }),
};

export async function getContact(
  client: ApolloClient,
  input: z.infer<typeof getContactDef.inputSchema>
) {
  return client.get(`/api/v1/contacts/${input.contact_id}`);
}

export const searchContactsDef = {
  name: "search_contacts" as const,
  description:
    "Search contacts in your Apollo CRM. FREE. " +
    "These are contacts you've already saved — not the global Apollo database. " +
    "Use search_people for prospecting new contacts.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search"),
    contact_stage_ids: z
      .array(z.string())
      .optional()
      .describe("Filter by contact stage IDs"),
    sort_by_field: z
      .string()
      .optional()
      .describe("Field to sort by, e.g. 'contact_last_activity_date'"),
    sort_ascending: z.boolean().optional().describe("Sort direction"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchContacts(
  client: ApolloClient,
  input: z.infer<typeof searchContactsDef.inputSchema>
) {
  const body = stripUndefined({ ...input });
  return client.post("/api/v1/contacts/search", body);
}

export const bulkCreateContactsDef = {
  name: "bulk_create_contacts" as const,
  description:
    "Create multiple contacts at once. FREE. Deduplication is enforced. Max 100 contacts per request.",
  inputSchema: z.object({
    contacts: z
      .array(
        z.object({
          first_name: z.string(),
          last_name: z.string(),
          email: z.string().optional(),
          title: z.string().optional(),
          organization_name: z.string().optional(),
          website_url: z.string().optional(),
          account_id: z.string().optional(),
          label_names: z.array(z.string()).optional(),
          present_raw_address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          country: z.string().optional(),
        })
      )
      .min(1)
      .max(100)
      .describe("Array of contact objects to create"),
  }),
};

export async function bulkCreateContacts(
  client: ApolloClient,
  input: z.infer<typeof bulkCreateContactsDef.inputSchema>
) {
  return client.post("/api/v1/contacts/bulk_create", {
    contacts: input.contacts,
    run_dedupe: true,
  });
}

export const bulkUpdateContactsDef = {
  name: "bulk_update_contacts" as const,
  description:
    "Update multiple contacts at once. FREE. Provide contact IDs and fields to update. Max 100 per request.",
  inputSchema: z.object({
    contacts: z
      .array(
        z.object({
          id: z.string().describe("Apollo contact ID"),
          first_name: z.string().optional(),
          last_name: z.string().optional(),
          email: z.string().optional(),
          title: z.string().optional(),
          organization_name: z.string().optional(),
          website_url: z.string().optional(),
          account_id: z.string().optional(),
          label_names: z.array(z.string()).optional(),
        })
      )
      .min(1)
      .max(100)
      .describe("Array of contact objects with IDs and updated fields"),
  }),
};

export async function bulkUpdateContacts(
  client: ApolloClient,
  input: z.infer<typeof bulkUpdateContactsDef.inputSchema>
) {
  return client.post("/api/v1/contacts/bulk_update", {
    contacts: input.contacts,
  });
}
