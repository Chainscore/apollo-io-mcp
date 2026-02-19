import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchSequencesDef = {
  name: "search_sequences" as const,
  description:
    "Search email sequences (campaigns) in your Apollo account. FREE. " +
    "Returns sequence name, status, stats, and IDs.",
  inputSchema: z.object({
    q_name: z.string().optional().describe("Search by sequence name"),
    sort_by_field: z
      .string()
      .optional()
      .describe("Field to sort by, e.g. 'name'"),
    sort_ascending: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchSequences(
  client: ApolloClient,
  input: z.infer<typeof searchSequencesDef.inputSchema>
) {
  const body = stripUndefined({ ...input });
  return client.post("/api/v1/emailer_campaigns/search", body);
}

export const addContactsToSequenceDef = {
  name: "add_contacts_to_sequence" as const,
  description:
    "Add contacts to an email sequence. FREE. " +
    "Provide the sequence ID and an array of contact IDs. " +
    "Contacts will start receiving the sequence emails. " +
    "You must also specify the email_account_id to send from.",
  inputSchema: z.object({
    emailer_campaign_id: z.string().describe("Sequence/campaign ID"),
    contact_ids: z
      .array(z.string())
      .min(1)
      .describe("Contact IDs to add to the sequence"),
    emailer_campaign_step_id: z
      .string()
      .optional()
      .describe("Step ID to start from (defaults to first step)"),
    send_email_from_email_account_id: z
      .string()
      .describe(
        "Email account ID to send from. Use list_email_accounts to find this."
      ),
    sequence_active_in_other_campaigns: z
      .boolean()
      .default(false)
      .describe("Allow adding contacts already active in other sequences"),
  }),
};

export async function addContactsToSequence(
  client: ApolloClient,
  input: z.infer<typeof addContactsToSequenceDef.inputSchema>
) {
  const { emailer_campaign_id, ...rest } = input;
  return client.post(
    `/api/v1/emailer_campaigns/${emailer_campaign_id}/add_contact_ids`,
    stripUndefined(rest)
  );
}

export const updateSequenceStatusDef = {
  name: "update_sequence_status" as const,
  description:
    "Remove or stop contacts in a sequence. FREE. " +
    "Use this to pause or remove contacts from an active sequence.",
  inputSchema: z.object({
    emailer_campaign_id: z.string().describe("Sequence/campaign ID"),
    contact_ids: z
      .array(z.string())
      .min(1)
      .describe("Contact IDs to remove/stop"),
    mode: z
      .enum(["remove", "stop"])
      .describe(
        "'remove' removes contacts entirely, 'stop' pauses their sequence"
      ),
  }),
};

export async function updateSequenceStatus(
  client: ApolloClient,
  input: z.infer<typeof updateSequenceStatusDef.inputSchema>
) {
  return client.post(
    "/api/v1/emailer_campaigns/remove_or_stop_contact_ids",
    {
      emailer_campaign_id: input.emailer_campaign_id,
      contact_ids: input.contact_ids,
      mode: input.mode,
    }
  );
}
