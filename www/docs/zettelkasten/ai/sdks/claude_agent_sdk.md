🗓️ 22052026 2100

# claude_agent_sdk

> The agent loop behind Claude Code, packaged as a library — define tools and a goal, the SDK runs the loop

## What it is

**Claude Agent SDK** is Anthropic's library for building autonomous programs powered by Claude. You give it a goal and tools; the SDK runs the model → tool → model loop until the goal is met.

You don't write the loop, manage messages, or decide when to stop. The SDK handles retries, context management, and tool dispatch.

## Core concept

```python
from claude_agent_sdk import tool, claude_sdk

@tool
def search_notes(query: str) -> str:
    """Search zettelkasten by keyword"""
    return format(index.search(query))

@tool
def write_file(path: str, content: str) -> str:
    """Save output to a file"""
    Path(path).write_text(content)
    return f"Saved to {path}"

result = claude_sdk.run(
    model="claude-sonnet-4-6",
    system="Search notes, synthesize findings, save a summary.",
    tools=[search_notes, write_file],
    prompt="Summarize what my notes say about database indexing."
)
```

You define **what** the agent can do. The SDK decides **how** — how many searches, what queries, when to stop.

## When to use it

| Situation | Use Agent SDK? |
|---|---|
| Multi-step pipeline (search → process → store) | Yes — SDK handles the loop |
| Ship a product feature powered by Claude | Yes — least boilerplate, built-in retries |
| Expose a DB or API to Claude Code / claude.ai | No — use an [[model_context_protocol]] server |
| Need custom control flow (parallel branches, human approval mid-loop) | No — write a DIY loop with the Anthropic SDK |

For a detailed comparison of MCP server vs Agent SDK vs DIY loop with the same project, see [[building_with_claude]].

## MCP composition

Agent SDK agents connect to MCP servers as tool sources. Build tools once as MCP, orchestrate from anywhere:

```python
result = claude_sdk.run(
    model="claude-sonnet-4-6",
    tools=[local_tool],
    mcp_servers=["zettelkasten"],
    prompt="..."
)
```

## Packages

| | Python | TypeScript |
|---|---|---|
| **Agent SDK** | `pip install claude-agent-sdk` | `npm install @anthropic-ai/claude-agent-sdk` |
| **MCP server** | `pip install mcp` | `npm install @modelcontextprotocol/sdk` |
| **DIY loop** | `pip install anthropic` | `npm install @anthropic-ai/sdk` |

---
## References
- [[building_with_claude]]
- [[model_context_protocol]]
- [[custom_mcp_servers]]
- [[llm_tool_use]]
- [Claude Agent SDK (GitHub)](https://github.com/anthropics/claude-agent-sdk-python)
- [Agent SDK Overview (Anthropic Docs)](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview)
- [Building Agents with Claude Agent SDK (Anthropic Blog)](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Claude Agent SDK Cookbooks](https://github.com/anthropics/claude-cookbooks/tree/main/claude_agent_sdk)
