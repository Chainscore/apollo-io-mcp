#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ApolloClient } from "./apollo-client.js";

// People tools
import {
  searchPeopleDef, searchPeople,
  enrichPersonDef, enrichPerson,
  bulkEnrichPeopleDef, bulkEnrichPeople,
} from "./tools/people.js";

// Organization tools
import {
  searchOrganizationsDef, searchOrganizations,
  enrichOrganizationDef, enrichOrganization,
  getOrganizationDef, getOrganization,
  getOrganizationJobPostingsDef, getOrganizationJobPostings,
} from "./tools/organizations.js";

// Contact tools
import {
  createContactDef, createContact,
  updateContactDef, updateContact,
  getContactDef, getContact,
  searchContactsDef, searchContacts,
  bulkCreateContactsDef, bulkCreateContacts,
  bulkUpdateContactsDef, bulkUpdateContacts,
} from "./tools/contacts.js";

// Account tools
import {
  createAccountDef, createAccount,
  updateAccountDef, updateAccount,
  searchAccountsDef, searchAccounts,
} from "./tools/accounts.js";

// Sequence tools
import {
  searchSequencesDef, searchSequences,
  addContactsToSequenceDef, addContactsToSequence,
  updateSequenceStatusDef, updateSequenceStatus,
} from "./tools/sequences.js";

// Email tools
import {
  searchOutreachEmailsDef, searchOutreachEmails,
  getEmailActivitiesDef, getEmailActivities,
  listEmailAccountsDef, listEmailAccounts,
} from "./tools/emails.js";

// Field tools
import {
  listFieldsDef, listFields,
  createCustomFieldDef, createCustomField,
  listCustomFieldsDeprecatedDef, listCustomFieldsDeprecated,
} from "./tools/fields.js";

// Usage tools
import {
  searchNewsArticlesDef, searchNewsArticles,
  getApiUsageStatsDef, getApiUsageStats,
} from "./tools/usage.js";

// --- Startup validation ---
const apiKey = process.env.APOLLO_API_KEY;
if (!apiKey) {
  console.error("ERROR: APOLLO_API_KEY environment variable is required.");
  process.exit(1);
}

const apollo = new ApolloClient(apiKey);

// --- MCP Server ---
const server = new McpServer({
  name: "apollo-io",
  version: "1.0.0",
});

// Helper to wrap handler results into MCP text content
async function handleToolCall(
  handler: () => Promise<Record<string, unknown>>
) {
  try {
    const result = await handler();
    return {
      content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      content: [{ type: "text" as const, text: JSON.stringify({ error: true, message }, null, 2) }],
      isError: true as const,
    };
  }
}

// =====================
// Register all 27 tools
// =====================

// --- People (3) ---
server.tool(
  searchPeopleDef.name,
  searchPeopleDef.description,
  searchPeopleDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchPeople(apollo, searchPeopleDef.inputSchema.parse(params)))
);

server.tool(
  enrichPersonDef.name,
  enrichPersonDef.description,
  enrichPersonDef.inputSchema.shape,
  async (params) => handleToolCall(() => enrichPerson(apollo, enrichPersonDef.inputSchema.parse(params)))
);

server.tool(
  bulkEnrichPeopleDef.name,
  bulkEnrichPeopleDef.description,
  bulkEnrichPeopleDef.inputSchema.shape,
  async (params) => handleToolCall(() => bulkEnrichPeople(apollo, bulkEnrichPeopleDef.inputSchema.parse(params)))
);

// --- Organizations (4) ---
server.tool(
  searchOrganizationsDef.name,
  searchOrganizationsDef.description,
  searchOrganizationsDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchOrganizations(apollo, searchOrganizationsDef.inputSchema.parse(params)))
);

server.tool(
  enrichOrganizationDef.name,
  enrichOrganizationDef.description,
  enrichOrganizationDef.inputSchema.shape,
  async (params) => handleToolCall(() => enrichOrganization(apollo, enrichOrganizationDef.inputSchema.parse(params)))
);

server.tool(
  getOrganizationDef.name,
  getOrganizationDef.description,
  getOrganizationDef.inputSchema.shape,
  async (params) => handleToolCall(() => getOrganization(apollo, getOrganizationDef.inputSchema.parse(params)))
);

server.tool(
  getOrganizationJobPostingsDef.name,
  getOrganizationJobPostingsDef.description,
  getOrganizationJobPostingsDef.inputSchema.shape,
  async (params) => handleToolCall(() => getOrganizationJobPostings(apollo, getOrganizationJobPostingsDef.inputSchema.parse(params)))
);

// --- Contacts (6) ---
server.tool(
  createContactDef.name,
  createContactDef.description,
  createContactDef.inputSchema.shape,
  async (params) => handleToolCall(() => createContact(apollo, createContactDef.inputSchema.parse(params)))
);

server.tool(
  updateContactDef.name,
  updateContactDef.description,
  updateContactDef.inputSchema.shape,
  async (params) => handleToolCall(() => updateContact(apollo, updateContactDef.inputSchema.parse(params)))
);

server.tool(
  getContactDef.name,
  getContactDef.description,
  getContactDef.inputSchema.shape,
  async (params) => handleToolCall(() => getContact(apollo, getContactDef.inputSchema.parse(params)))
);

server.tool(
  searchContactsDef.name,
  searchContactsDef.description,
  searchContactsDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchContacts(apollo, searchContactsDef.inputSchema.parse(params)))
);

server.tool(
  bulkCreateContactsDef.name,
  bulkCreateContactsDef.description,
  bulkCreateContactsDef.inputSchema.shape,
  async (params) => handleToolCall(() => bulkCreateContacts(apollo, bulkCreateContactsDef.inputSchema.parse(params)))
);

server.tool(
  bulkUpdateContactsDef.name,
  bulkUpdateContactsDef.description,
  bulkUpdateContactsDef.inputSchema.shape,
  async (params) => handleToolCall(() => bulkUpdateContacts(apollo, bulkUpdateContactsDef.inputSchema.parse(params)))
);

// --- Accounts (3) ---
server.tool(
  createAccountDef.name,
  createAccountDef.description,
  createAccountDef.inputSchema.shape,
  async (params) => handleToolCall(() => createAccount(apollo, createAccountDef.inputSchema.parse(params)))
);

server.tool(
  updateAccountDef.name,
  updateAccountDef.description,
  updateAccountDef.inputSchema.shape,
  async (params) => handleToolCall(() => updateAccount(apollo, updateAccountDef.inputSchema.parse(params)))
);

server.tool(
  searchAccountsDef.name,
  searchAccountsDef.description,
  searchAccountsDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchAccounts(apollo, searchAccountsDef.inputSchema.parse(params)))
);

// --- Sequences (3) ---
server.tool(
  searchSequencesDef.name,
  searchSequencesDef.description,
  searchSequencesDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchSequences(apollo, searchSequencesDef.inputSchema.parse(params)))
);

server.tool(
  addContactsToSequenceDef.name,
  addContactsToSequenceDef.description,
  addContactsToSequenceDef.inputSchema.shape,
  async (params) => handleToolCall(() => addContactsToSequence(apollo, addContactsToSequenceDef.inputSchema.parse(params)))
);

server.tool(
  updateSequenceStatusDef.name,
  updateSequenceStatusDef.description,
  updateSequenceStatusDef.inputSchema.shape,
  async (params) => handleToolCall(() => updateSequenceStatus(apollo, updateSequenceStatusDef.inputSchema.parse(params)))
);

// --- Emails (3) ---
server.tool(
  searchOutreachEmailsDef.name,
  searchOutreachEmailsDef.description,
  searchOutreachEmailsDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchOutreachEmails(apollo, searchOutreachEmailsDef.inputSchema.parse(params)))
);

server.tool(
  getEmailActivitiesDef.name,
  getEmailActivitiesDef.description,
  getEmailActivitiesDef.inputSchema.shape,
  async (params) => handleToolCall(() => getEmailActivities(apollo, getEmailActivitiesDef.inputSchema.parse(params)))
);

server.tool(
  listEmailAccountsDef.name,
  listEmailAccountsDef.description,
  listEmailAccountsDef.inputSchema.shape,
  async (params) => handleToolCall(() => listEmailAccounts(apollo, listEmailAccountsDef.inputSchema.parse(params)))
);

// --- Fields (3) ---
server.tool(
  listFieldsDef.name,
  listFieldsDef.description,
  listFieldsDef.inputSchema.shape,
  async (params) => handleToolCall(() => listFields(apollo, listFieldsDef.inputSchema.parse(params)))
);

server.tool(
  createCustomFieldDef.name,
  createCustomFieldDef.description,
  createCustomFieldDef.inputSchema.shape,
  async (params) => handleToolCall(() => createCustomField(apollo, createCustomFieldDef.inputSchema.parse(params)))
);

server.tool(
  listCustomFieldsDeprecatedDef.name,
  listCustomFieldsDeprecatedDef.description,
  listCustomFieldsDeprecatedDef.inputSchema.shape,
  async (params) => handleToolCall(() => listCustomFieldsDeprecated(apollo, listCustomFieldsDeprecatedDef.inputSchema.parse(params)))
);

// --- Usage (2) ---
server.tool(
  searchNewsArticlesDef.name,
  searchNewsArticlesDef.description,
  searchNewsArticlesDef.inputSchema.shape,
  async (params) => handleToolCall(() => searchNewsArticles(apollo, searchNewsArticlesDef.inputSchema.parse(params)))
);

server.tool(
  getApiUsageStatsDef.name,
  getApiUsageStatsDef.description,
  getApiUsageStatsDef.inputSchema.shape,
  async (params) => handleToolCall(() => getApiUsageStats(apollo, getApiUsageStatsDef.inputSchema.parse(params)))
);

// --- Start ---
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
