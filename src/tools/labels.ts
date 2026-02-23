import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const listLabelsDef = {
  name: "list_labels" as const,
  description:
    "List all labels (tags/lists) in your Apollo workspace. FREE. " +
    "Labels are used to organize contacts and accounts into groups. " +
    "Undocumented endpoint.",
  inputSchema: z.object({}),
};

export async function listLabels(
  client: ApolloClient,
  _input: z.infer<typeof listLabelsDef.inputSchema>
) {
  return client.get("/api/v1/labels");
}

export const createLabelDef = {
  name: "create_label" as const,
  description:
    "Create a new label (tag/list) in Apollo. FREE. " +
    "Labels help organize contacts and accounts. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    name: z.string().describe("Label name, e.g. 'Hot Leads Q1'"),
    modality: z
      .enum(["contacts", "accounts"])
      .default("contacts")
      .describe("Whether this label applies to contacts or accounts"),
  }),
};

export async function createLabel(
  client: ApolloClient,
  input: z.infer<typeof createLabelDef.inputSchema>
) {
  return client.post("/api/v1/labels", stripUndefined({ ...input }));
}

export const updateLabelDef = {
  name: "update_label" as const,
  description:
    "Update a label name in Apollo. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    label_id: z.string().describe("Label ID to update"),
    name: z.string().describe("New name for the label"),
  }),
};

export async function updateLabel(
  client: ApolloClient,
  input: z.infer<typeof updateLabelDef.inputSchema>
) {
  return client.patch(`/api/v1/labels/${input.label_id}`, {
    name: input.name,
  });
}

export const deleteLabelDef = {
  name: "delete_label" as const,
  description:
    "Delete a label from Apollo. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    label_id: z.string().describe("Label ID to delete"),
  }),
};

export async function deleteLabel(
  client: ApolloClient,
  input: z.infer<typeof deleteLabelDef.inputSchema>
) {
  return client.del(`/api/v1/labels/${input.label_id}`);
}
