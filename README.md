# Apollo.io MCP Server

A [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the **Apollo.io API** — giving AI coding assistants like **Claude Code**, **Cursor**, and any MCP-compatible client direct access to Apollo.io's sales intelligence platform.

Search leads, enrich contacts with verified emails and phone numbers, manage CRM records, run email sequences, and track outreach — all through natural language via **27 ready-to-use tools**.

## Why Use This?

- **AI-native prospecting** — Ask your AI assistant to "find CTOs at Series B fintech companies in NYC" and get results instantly
- **Automated enrichment** — Enrich leads with verified emails and phone numbers without leaving your editor
- **CRM operations** — Create, update, and search contacts and accounts through conversation
- **Sequence management** — Add contacts to email sequences and monitor outreach performance
- **Credit-aware** — Every tool description includes credit cost so your AI avoids unexpected charges

## Quick Start

### 1. Clone & Build

```bash
git clone https://github.com/Chainscore/apollo-io-mcp.git
cd apollo-io-mcp
npm install
npm run build
```

### 2. Get Your Apollo API Key

Get your API key from [Apollo.io Settings > Integrations > API](https://app.apollo.io/#/settings/integrations/api).

### 3. Add to Your MCP Client

**Claude Code** (`~/.claude/settings.json`):
```json
{
  "mcpServers": {
    "apollo-io": {
      "command": "node",
      "args": ["/path/to/apollo-io-mcp/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_key_here"
      }
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "apollo-io": {
      "command": "node",
      "args": ["/path/to/apollo-io-mcp/dist/index.js"],
      "env": {
        "APOLLO_API_KEY": "your_key_here"
      }
    }
  }
}
```

## Tools (27)

### People Search & Enrichment
| Tool | Description | Cost |
|------|-------------|------|
| `search_people` | Search Apollo's 270M+ contact database by title, company, location, seniority | FREE |
| `enrich_person` | Get verified email, phone number, and full profile for a person | 1 credit |
| `bulk_enrich_people` | Enrich up to 10 people in a single request | 1 credit/person |

### Company / Organization Data
| Tool | Description | Cost |
|------|-------------|------|
| `search_organizations` | Search companies by name, industry, employee count, revenue | 1 credit/page |
| `enrich_organization` | Get detailed company info (tech stack, funding, size) by domain | 1 credit |
| `get_organization` | Get organization details by Apollo ID | FREE |
| `get_organization_job_postings` | Get current job postings for a company | 1 credit |

### CRM — Contacts
| Tool | Description | Cost |
|------|-------------|------|
| `create_contact` | Create a contact with automatic deduplication | FREE |
| `update_contact` | Update an existing contact | FREE |
| `get_contact` | Retrieve a contact by ID | FREE |
| `search_contacts` | Search your saved contacts | FREE |
| `bulk_create_contacts` | Create up to 100 contacts at once | FREE |
| `bulk_update_contacts` | Update up to 100 contacts at once | FREE |

### CRM — Accounts
| Tool | Description | Cost |
|------|-------------|------|
| `create_account` | Create a company record in your CRM | FREE |
| `update_account` | Update an existing account | FREE |
| `search_accounts` | Search your saved accounts | FREE |

### Email Sequences & Outreach
| Tool | Description | Cost |
|------|-------------|------|
| `search_sequences` | Search email sequences/campaigns | FREE |
| `add_contacts_to_sequence` | Add contacts to an email sequence | FREE |
| `update_sequence_status` | Remove or pause contacts in a sequence | FREE |
| `search_outreach_emails` | Search sent outreach emails with open/click tracking | FREE |
| `get_email_activities` | Get opens, clicks, and replies for an email | FREE |
| `list_email_accounts` | List connected sending email accounts | FREE |

### Custom Fields & Metadata
| Tool | Description | Cost |
|------|-------------|------|
| `list_fields` | List all available fields for contacts/accounts | FREE |
| `create_custom_field` | Create a custom field (text, number, dropdown, etc.) | FREE |
| `list_custom_fields_deprecated` | List custom fields via legacy endpoint | FREE |

### News & Usage
| Tool | Description | Cost |
|------|-------------|------|
| `search_news_articles` | Search recent news about target companies | Credits |
| `get_api_usage_stats` | Check API credit usage and remaining balance | FREE |

## Usage Tips

- **Verify your setup** — Start with `get_api_usage_stats` (FREE) to confirm your API key works
- **Save credits** — Use `search_people` (FREE) for prospecting before enriching with `enrich_person` (1 credit)
- **Prefer people search** — `search_people` is free while `search_organizations` costs 1 credit/page
- **Auto-cleaned domains** — Pass `https://www.google.com`, `www.google.com`, or `@google.com` — all resolve to `google.com`
- **Built-in deduplication** — Contact creation enforces dedup so you never accidentally create duplicates

## Requirements

- Node.js 18+
- Apollo.io API key ([get one here](https://app.apollo.io/#/settings/integrations/api))
- An MCP-compatible client (Claude Code, Cursor, etc.)

## License

MIT

## Contact

Need help integrating this MCP server into your workflow? Reach out at **[prasad@chainscorelabs.com](mailto:prasad@chainscorelabs.com)**.

Built by [Chainscore](https://github.com/Chainscore).
