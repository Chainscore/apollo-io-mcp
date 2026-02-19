const BASE_URL = "https://api.apollo.io";

export class ApolloClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request(
    method: string,
    path: string,
    body?: Record<string, unknown>,
    queryParams?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    let url = `${BASE_URL}${path}`;

    if (queryParams) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(queryParams)) {
        if (value !== undefined && value !== "") {
          params.append(key, value);
        }
      }
      const qs = params.toString();
      if (qs) {
        url += `?${qs}`;
      }
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Api-Key": this.apiKey,
    };

    const options: RequestInit = { method, headers };
    if (body && (method === "POST" || method === "PATCH" || method === "PUT")) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    let data: Record<string, unknown>;
    const text = await response.text();
    try {
      data = JSON.parse(text) as Record<string, unknown>;
    } catch {
      data = { raw_response: text };
    }

    if (!response.ok) {
      return {
        error: true,
        status: response.status,
        message:
          (data as Record<string, unknown>).message ||
          (data as Record<string, unknown>).error ||
          response.statusText,
        details: data,
      };
    }

    return data;
  }

  async get(
    path: string,
    queryParams?: Record<string, string>
  ): Promise<Record<string, unknown>> {
    return this.request("GET", path, undefined, queryParams);
  }

  async post(
    path: string,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.request("POST", path, body);
  }

  async patch(
    path: string,
    body?: Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    return this.request("PATCH", path, body);
  }
}

/** Strip protocol, www., and @ from a domain string */
export function cleanDomain(domain: string): string {
  return domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/^@/, "")
    .replace(/\/.*$/, "");
}

/** Remove undefined values from an object (for cleaner API payloads) */
export function stripUndefined(
  obj: Record<string, unknown>
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
}
