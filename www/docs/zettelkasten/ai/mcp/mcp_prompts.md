🗓️ 23052026 2200

# mcp_prompts

> User-controlled message templates that servers expose — typically surfaced as slash commands

## What prompts are

**Prompts** are reusable templates for structured LLM interactions. Servers define them; users explicitly select which to use. This makes prompts **user-controlled**, unlike tools (LLM-controlled) or resources (app-controlled).

Common surface: slash commands in a chat UI (e.g., `/code_review`, `/explain_error`).

## Protocol methods

### Discovery

`prompts/list` returns available prompts with their arguments:

```json
{
  "prompts": [
    {
      "name": "code_review",
      "title": "Request Code Review",
      "description": "Analyze code quality and suggest improvements",
      "arguments": [
        { "name": "code", "description": "The code to review", "required": true }
      ]
    }
  ]
}
```

### Retrieval

`prompts/get` fetches a prompt with arguments filled in. Returns an array of messages ready to send to the LLM:

```json
{
  "description": "Code review prompt",
  "messages": [
    {
      "role": "user",
      "content": {
        "type": "text",
        "text": "Please review this Python code:\ndef hello():\n    print('world')"
      }
    }
  ]
}
```

### Change notifications

Servers with `listChanged: true` send `notifications/prompts/list_changed` when prompts are added or removed.

## Message content types

Prompt messages can include:

| Type | Use |
|---|---|
| **Text** | Plain text — most common |
| **Image** | Base64-encoded image data with MIME type |
| **Audio** | Base64-encoded audio data with MIME type |
| **Embedded resource** | Inline server-side resource content (text or binary) |

Embedded resources let prompts pull in server-managed content — docs, code samples, reference data — directly into the conversation.

```json
{
  "type": "resource",
  "resource": {
    "uri": "resource://example",
    "mimeType": "text/plain",
    "text": "Resource content"
  }
}
```

## Multi-message prompts

Prompts can return multiple messages with different roles (`user`, `assistant`), enabling few-shot examples or pre-structured conversations.

---
## References
- [[model_context_protocol]]
- [[mcp_resources]]
- [MCP Prompts — Official Docs](https://modelcontextprotocol.io/docs/concepts/prompts)
