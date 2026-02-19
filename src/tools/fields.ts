import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const listFieldsDef = {
  name: "list_fields" as const,
  description:
    "List all available fields for contacts and accounts in Apollo. FREE. " +
    "Useful for understanding what data you can search/filter on.",
  inputSchema: z.object({
    entity_type: z
      .enum(["contact", "account", "opportunity"])
      .optional()
      .describe("Filter fields by entity type"),
  }),
};

export async function listFields(
  client: ApolloClient,
  input: z.infer<typeof listFieldsDef.inputSchema>
) {
  const params: Record<string, string> = {};
  if (input.entity_type) params.entity_type = input.entity_type;
  return client.get("/api/v1/fields", params);
}

export const createCustomFieldDef = {
  name: "create_custom_field" as const,
  description:
    "Create a custom field for contacts or accounts. FREE. " +
    "Custom fields let you store additional data on your CRM records.",
  inputSchema: z.object({
    name: z.string().describe("Display name for the field"),
    field_type: z
      .enum([
        "text",
        "number",
        "date",
        "datetime",
        "boolean",
        "dropdown",
        "star_rating",
      ])
      .describe("Data type of the field"),
    entity_type: z
      .enum(["contact", "account", "opportunity"])
      .describe("Which entity type this field applies to"),
    picklist_values: z
      .array(z.string())
      .optional()
      .describe("Options for dropdown type fields"),
  }),
};

export async function createCustomField(
  client: ApolloClient,
  input: z.infer<typeof createCustomFieldDef.inputSchema>
) {
  return client.post("/api/v1/fields", stripUndefined({ ...input }));
}

export const listCustomFieldsDeprecatedDef = {
  name: "list_custom_fields_deprecated" as const,
  description:
    "List custom fields using the legacy typed_custom_fields endpoint. FREE. " +
    "Prefer list_fields instead. This endpoint is deprecated but still functional.",
  inputSchema: z.object({}),
};

export async function listCustomFieldsDeprecated(
  client: ApolloClient,
  _input: z.infer<typeof listCustomFieldsDeprecatedDef.inputSchema>
) {
  return client.get("/api/v1/typed_custom_fields");
}
