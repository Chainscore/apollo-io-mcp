import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchNotesDef = {
  name: "search_notes" as const,
  description:
    "Search notes in your Apollo workspace. FREE. " +
    "Notes can be attached to contacts, accounts, or opportunities. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search in notes"),
    contact_id: z.string().optional().describe("Filter notes for a specific contact"),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchNotes(
  client: ApolloClient,
  input: z.infer<typeof searchNotesDef.inputSchema>
) {
  return client.post("/api/v1/notes/search", stripUndefined({ ...input }));
}

export const createNoteDef = {
  name: "create_note" as const,
  description:
    "Create a note in Apollo. FREE. " +
    "Notes can be associated with a contact. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    content: z.string().describe("Note content/body text"),
    contact_id: z.string().optional().describe("Contact ID to attach the note to"),
  }),
};

export async function createNote(
  client: ApolloClient,
  input: z.infer<typeof createNoteDef.inputSchema>
) {
  return client.post("/api/v1/notes", stripUndefined({ ...input }));
}

export const deleteNoteDef = {
  name: "delete_note" as const,
  description:
    "Delete a note from Apollo. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    note_id: z.string().describe("Note ID to delete"),
  }),
};

export async function deleteNote(
  client: ApolloClient,
  input: z.infer<typeof deleteNoteDef.inputSchema>
) {
  return client.del(`/api/v1/notes/${input.note_id}`);
}
