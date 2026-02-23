import { z } from "zod";
import { ApolloClient } from "../apollo-client.js";

export const healthCheckDef = {
  name: "health_check" as const,
  description:
    "Check Apollo API health and verify your API key is working. FREE. " +
    "Returns basic account info if the key is valid. Undocumented endpoint.",
  inputSchema: z.object({}),
};

export async function healthCheck(
  client: ApolloClient,
  _input: z.infer<typeof healthCheckDef.inputSchema>
) {
  return client.get("/api/v1/auth/health");
}
