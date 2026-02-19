# Apollo.io MCP Server

MCP (Model Context Protocol) server that wraps the Apollo.io REST API, enabling Claude Code and other MCP clients to search people/companies, enrich contacts, manage sequences, and perform outreach operations.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Build:
   ```bash
   npm run build
   ```

3. Set your Apollo API key:
   ```bash
   export APOLLO_API_KEY=your_key_here
   ```

4. Add to your MCP client config (e.g. Claude Code `~/.claude/settings.json`):
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

### People
| Tool | Description | Cost |
|------|-------------|------|
| `search_people` | Search Apollo's database for people by title, company, location, etc. | FREE |
| `enrich_person` | Get email, phone, and detailed profile for a person | 1 credit |
| `bulk_enrich_people` | Enrich multiple people in one request (max 10) | 1 credit/person |

### Organizations
| Tool | Description | Cost |
|------|-------------|------|
| `search_organizations` | Search for companies by name, industry, size, revenue | 1 credit/page |
| `enrich_organization` | Get detailed company info by domain | 1 credit |
| `get_organization` | Get organization by Apollo ID | FREE |
| `get_organization_job_postings` | Get job postings for an organization | 1 credit |

### Contacts (CRM)
| Tool | Description | Cost |
|------|-------------|------|
| `create_contact` | Create a contact in your CRM (deduplication enforced) | FREE |
| `update_contact` | Update an existing contact | FREE |
| `get_contact` | Get a contact by ID | FREE |
| `search_contacts` | Search your saved contacts | FREE |
| `bulk_create_contacts` | Create multiple contacts (max 100) | FREE |
| `bulk_update_contacts` | Update multiple contacts (max 100) | FREE |

### Accounts (CRM)
| Tool | Description | Cost |
|------|-------------|------|
| `create_account` | Create a company record in your CRM | FREE |
| `update_account` | Update an existing account | FREE |
| `search_accounts` | Search your saved accounts | FREE |

### Sequences
| Tool | Description | Cost |
|------|-------------|------|
| `search_sequences` | Search email sequences/campaigns | FREE |
| `add_contacts_to_sequence` | Add contacts to an email sequence | FREE |
| `update_sequence_status` | Remove or stop contacts in a sequence | FREE |

### Emails
| Tool | Description | Cost |
|------|-------------|------|
| `search_outreach_emails` | Search sent outreach emails | FREE |
| `get_email_activities` | Get opens/clicks/replies for an email | FREE |
| `list_email_accounts` | List connected email accounts (master key required) | FREE |

### Fields
| Tool | Description | Cost |
|------|-------------|------|
| `list_fields` | List available fields for contacts/accounts | FREE |
| `create_custom_field` | Create a custom field | FREE |
| `list_custom_fields_deprecated` | List custom fields (legacy endpoint) | FREE |

### Other
| Tool | Description | Cost |
|------|-------------|------|
| `search_news_articles` | Search news articles about companies | Credits |
| `get_api_usage_stats` | Get API usage and credit info | FREE |

## Usage Tips

- Start with `get_api_usage_stats` to verify your API key works
- Use `search_people` (FREE) for prospecting before enriching with `enrich_person` (1 credit)
- Prefer `search_people` over `search_organizations` to save credits
- Domains are auto-cleaned — you can pass `https://www.google.com` and it becomes `google.com`
- Contact creation always deduplicates to prevent duplicates

## Contact

Need help integrating this MCP server? Reach out to us at [prasad@chainscorelabs.com](mailto:prasad@chainscorelabs.com).

Built by [Chainscore](https://github.com/Chainscore).
