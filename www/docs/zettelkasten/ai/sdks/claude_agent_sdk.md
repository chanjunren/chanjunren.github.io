🗓️ 22052026 2100

# claude_agent_sdk

> The agent loop behind Claude Code, packaged as a library — define tools and a goal, the SDK runs the loop

## Three ways to build with Claude

Each answers a different question:

- **MCP server** — "How do I let Claude access my stuff?"
- **Agent SDK** — "How do I build a program that uses Claude to do multi-step work?"
- **DIY agent loop** — "How do I control every detail of how Claude calls tools?"

## Same task, three approaches

**Task**: let Claude search your zettelkasten notes and write a summary.

### MCP server

You build a **passive tool provider**. Claude Code connects to it and decides when to call your tools. You don't control the workflow.

```python
from mcp.server import Server

server = Server("zettelkasten")

@server.tool("search_notes", description="Search zettelkasten by keyword")
async def search_notes(query: str):
    return index.search(query)

# Register in settings.json, restart Claude Code.
# Claude Code now calls search_notes whenever it thinks it's useful.
# You never see the conversation or control when it's called.
```

**~10 lines.** You expose a capability. The host decides the rest.

### Agent SDK

You build an **autonomous program**. Give it a goal and tools, the SDK runs the model → tool → model loop until done.

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
# The SDK autonomously: searches → reads → searches again → writes summary.
# You defined tools + goal. SDK decided how many searches, what queries, when to stop.
```

**~20 lines.** You define what the agent can do. The SDK decides how.

### DIY agent loop

You build **everything**. You write the `while` loop, dispatch tools, manage messages, decide when to stop.

```python
from anthropic import Anthropic

client = Anthropic()
tools = [{"name": "search_notes", "input_schema": {...}, ...}]
messages = [{"role": "user", "content": "Summarize my notes on indexing"}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6", tools=tools, messages=messages, max_tokens=4096
    )
    tool_calls = [b for b in response.content if b.type == "tool_use"]
    if not tool_calls:
        print(response.content[0].text)
        break

    messages.append({"role": "assistant", "content": response.content})
    results = []
    for tc in tool_calls:
        output = my_dispatch(tc.name, tc.input)   # your code
        results.append({"type": "tool_result", "tool_use_id": tc.id, "content": output})
    messages.append({"role": "user", "content": results})
```

**~30 lines minimum.** You own every decision: dispatch, error handling, stop conditions, context management.

## When to use what

| Situation | Use | Why |
|---|---|---|
| Expose a DB or API to Claude Code / claude.ai | **MCP server** | Multiple clients reuse it; no orchestration needed |
| Multi-step pipeline (search → process → store) | **Agent SDK** | SDK handles the loop; you focus on tools + goal |
| Need custom control flow (parallel branches, human approval mid-loop) | **DIY loop** | SDK doesn't support your specific orchestration |
| Prototype to learn how agents work | **DIY loop** | You learn by building the loop yourself |
| Extend claude.ai desktop with new capabilities | **MCP server** | Only way to add tools to hosted Claude clients |
| Ship a product feature powered by Claude | **Agent SDK** | Least boilerplate; built-in retries, context management |

### Mapped to concrete projects

- **Zettelkasten search** → MCP server. Expose 484 notes to Claude Code + claude.ai. Claude decides when to search.
- **Song lyrics pipeline** (Chocobo) → Agent SDK. Search lyrics → translate line-by-line → add romanization → store in DB. Multi-step, autonomous.
- **ETL monitor** → MCP server if you want it in Claude Code; Agent SDK if you want a standalone CLI that chains Prefect + Metabase + SQL queries to diagnose issues.
- **BI chat agent** → Agent SDK. Receive question → generate SQL → execute → format results → explain. Autonomous workflow with safety guardrails.

## They compose

Agent SDK agents connect to MCP servers as tool sources. Build tools once as MCP, orchestrate them from anywhere:

```python
result = claude_sdk.run(
    model="claude-sonnet-4-6",
    tools=[local_tool],                # in-process tool
    mcp_servers=["zettelkasten"],       # remote MCP server adds more tools
    prompt="..."
)
```

## Packages

| | Python | TypeScript |
|---|---|---|
| **MCP server** | `pip install mcp` | `npm install @modelcontextprotocol/sdk` |
| **Agent SDK** | `pip install claude-agent-sdk` | `npm install @anthropic-ai/claude-agent-sdk` |
| **DIY loop** | `pip install anthropic` | `npm install @anthropic-ai/sdk` |

---
## References
- [[model_context_protocol]]
- [[custom_mcp_servers]]
- [[llm_tool_use]]
- [Claude Agent SDK (GitHub)](https://github.com/anthropics/claude-agent-sdk-python)
- [Agent SDK Overview (Anthropic Docs)](https://docs.anthropic.com/en/docs/claude-code/sdk/sdk-overview)
- [Building Agents with Claude Agent SDK (Anthropic Blog)](https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk)
- [Claude Agent SDK Cookbooks](https://github.com/anthropics/claude-cookbooks/tree/main/claude_agent_sdk)
