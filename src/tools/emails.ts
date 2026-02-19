import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchOutreachEmailsDef = {
  name: "search_outreach_emails" as const,
  description:
    "Search outreach emails sent through Apollo sequences. FREE. " +
    "Returns email messages with status, open/click tracking, and content.",
  inputSchema: z.object({
    emailer_campaign_id: z
      .string()
      .optional()
      .describe("Filter by sequence/campaign ID"),
    contact_id: z
      .string()
      .optional()
      .describe("Filter by contact ID"),
    email_account_id: z
      .string()
      .optional()
      .describe("Filter by sending email account ID"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchOutreachEmails(
  client: ApolloClient,
  input: z.infer<typeof searchOutreachEmailsDef.inputSchema>
) {
  const params: Record<string, string> = {};
  if (input.emailer_campaign_id)
    params.emailer_campaign_id = input.emailer_campaign_id;
  if (input.contact_id) params.contact_id = input.contact_id;
  if (input.email_account_id)
    params.email_account_id = input.email_account_id;
  params.page = String(input.page);
  params.per_page = String(input.per_page);
  return client.get("/api/v1/emailer_messages/search", params);
}

export const getEmailActivitiesDef = {
  name: "get_email_activities" as const,
  description:
    "Get activities (opens, clicks, replies) for a specific outreach email. FREE.",
  inputSchema: z.object({
    emailer_message_id: z.string().describe("Emailer message ID"),
  }),
};

export async function getEmailActivities(
  client: ApolloClient,
  input: z.infer<typeof getEmailActivitiesDef.inputSchema>
) {
  return client.get(
    `/api/v1/emailer_messages/${input.emailer_message_id}/activities`
  );
}

export const listEmailAccountsDef = {
  name: "list_email_accounts" as const,
  description:
    "List all email accounts connected to your Apollo workspace. FREE. " +
    "Use this to find the email_account_id needed for add_contacts_to_sequence. " +
    "Requires a master API key.",
  inputSchema: z.object({}),
};

export async function listEmailAccounts(
  client: ApolloClient,
  _input: z.infer<typeof listEmailAccountsDef.inputSchema>
) {
  return client.get("/api/v1/email_accounts");
}
