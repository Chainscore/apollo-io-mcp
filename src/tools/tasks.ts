import { z } from "zod";
import { ApolloClient, stripUndefined } from "../apollo-client.js";

export const searchTasksDef = {
  name: "search_tasks" as const,
  description:
    "Search tasks in your Apollo workspace. FREE. " +
    "Returns manual tasks, call tasks, and sequence-triggered tasks. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    q_keywords: z.string().optional().describe("Keyword search"),
    user_id: z.string().optional().describe("Filter by assigned user ID"),
    completed: z.boolean().optional().describe("Filter by completion status"),
    sort_by_field: z.string().optional(),
    sort_ascending: z.boolean().optional(),
    page: z.number().int().min(1).default(1),
    per_page: z.number().int().min(1).max(100).default(25),
  }),
};

export async function searchTasks(
  client: ApolloClient,
  input: z.infer<typeof searchTasksDef.inputSchema>
) {
  return client.post("/api/v1/tasks/search", stripUndefined({ ...input }));
}

export const getTaskDef = {
  name: "get_task" as const,
  description:
    "Get a single task by ID. FREE. Undocumented endpoint.",
  inputSchema: z.object({
    task_id: z.string().describe("Apollo task ID"),
  }),
};

export async function getTask(
  client: ApolloClient,
  input: z.infer<typeof getTaskDef.inputSchema>
) {
  return client.get(`/api/v1/tasks/${input.task_id}`);
}

export const createTaskDef = {
  name: "create_task" as const,
  description:
    "Create a new task in Apollo. FREE. " +
    "Tasks can be associated with contacts. Requires a user_id for assignment. " +
    "Undocumented endpoint.",
  inputSchema: z.object({
    user_id: z.string().describe("User ID to assign the task to (use search_users to find)"),
    contact_id: z.string().optional().describe("Contact ID to associate with"),
    type: z
      .enum(["call", "email", "other", "linkedin"])
      .default("other")
      .describe("Task type"),
    priority: z
      .enum(["high", "medium", "low"])
      .default("medium")
      .describe("Task priority"),
    note: z.string().optional().describe("Task description/note"),
    due_at: z.string().optional().describe("Due date in ISO 8601, e.g. '2026-03-01T09:00:00Z'"),
  }),
};

export async function createTask(
  client: ApolloClient,
  input: z.infer<typeof createTaskDef.inputSchema>
) {
  return client.post("/api/v1/tasks", stripUndefined({ ...input }));
}

export const updateTaskDef = {
  name: "update_task" as const,
  description:
    "Update an existing task. FREE. Can mark as completed. Undocumented endpoint.",
  inputSchema: z.object({
    task_id: z.string().describe("Apollo task ID"),
    note: z.string().optional().describe("Updated task note"),
    completed: z.boolean().optional().describe("Mark as completed"),
    priority: z.enum(["high", "medium", "low"]).optional(),
    due_at: z.string().optional(),
  }),
};

export async function updateTask(
  client: ApolloClient,
  input: z.infer<typeof updateTaskDef.inputSchema>
) {
  const { task_id, ...rest } = input;
  return client.patch(`/api/v1/tasks/${task_id}`, stripUndefined(rest));
}
