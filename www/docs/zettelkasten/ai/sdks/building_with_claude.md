🗓️ 23052026 2300

# building_with_claude

> Three ways to build with Claude — MCP server, Agent SDK, DIY loop — compared through one project

## The project: zettelkasten question bank generator

Read markdown notes, generate study Q&A pairs, save results. Same goal, three approaches — each answers a different question:

- **MCP server** — "How do I let Claude access my stuff?"
- **Agent SDK** — "How do I build a program that does multi-step work?"
- **DIY agent loop** — "How do I control every detail?"

## MCP server approach

You build a **passive tool provider**. Claude Code connects to it and decides when to call your tools. You don't control the workflow — the host does.

```python
from mcp.server import Server

server = Server("zettelkasten")

@server.tool("search_notes", description="Search zettelkasten by keyword")
async def search_notes(query: str):
    return index.search(query)

@server.tool("get_note", description="Read a specific note by path")
async def get_note(path: str):
    return Path(f"docs/zettelkasten/{path}").read_text()
```

Register in Claude Code `settings.json`, restart. Then prompt Claude Code: "Read my MCP notes and generate study questions." Claude decides which tools to call and when.

**\~10 lines.** You expose capabilities. The host decides the rest.

### Tradeoff

No control over the generation workflow. Claude Code might read one note or all of them — you can't enforce "read all notes in `ai/mcp/`, then generate exactly 3 questions per note."

## Agent SDK approach

You build an **autonomous program**. Define tools + goal, the SDK runs the loop.

```python
from claude_agent_sdk import tool, claude_sdk

@tool
def list_notes(directory: str) -> str:
    """List all markdown files in a zettelkasten directory"""
    return "\n".join(str(p) for p in Path(directory).glob("*.md"))

@tool
def read_note(path: str) -> str:
    """Read the full content of a zettelkasten note"""
    return Path(path).read_text()

@tool
def save_questions(path: str, content: str) -> str:
    """Save generated Q&A pairs to a file"""
    Path(path).write_text(content)
    return f"Saved to {path}"

result = claude_sdk.run(
    model="claude-sonnet-4-6",
    system="""Read all notes in the given directory.
    For each note, generate 3 study questions with answers.
    Save the full Q&A bank to a single file.""",
    tools=[list_notes, read_note, save_questions],
    prompt="Generate a question bank from docs/zettelkasten/ai/mcp/"
)
```

**\~25 lines.** You define what the agent can do. The SDK decides how — which notes to read first, how to batch, when to stop.

### Tradeoff

Good balance of control and convenience. You set the goal and constraints in the system prompt, but can't intervene mid-loop (no human approval between steps, no conditional branching based on intermediate results).

## DIY loop approach

You build **everything**. You write the `while` loop, dispatch tools, manage messages, decide when to stop.

```python
from anthropic import Anthropic

client = Anthropic()
tools = [
    {"name": "list_notes", "input_schema": {"type": "object", "properties": {"directory": {"type": "string"}}, "required": ["directory"]}},
    {"name": "read_note", "input_schema": {"type": "object", "properties": {"path": {"type": "string"}}, "required": ["path"]}},
]
messages = [{"role": "user", "content": "List notes in docs/zettelkasten/ai/mcp/, then generate 3 questions per note."}]

while True:
    response = client.messages.create(
        model="claude-sonnet-4-6", tools=tools, messages=messages, max_tokens=4096
    )
    tool_calls = [b for b in response.content if b.type == "tool_use"]
    if not tool_calls:
        Path("question_bank.md").write_text(response.content[0].text)
        break

    messages.append({"role": "assistant", "content": response.content})
    results = []
    for tc in tool_calls:
        output = dispatch(tc.name, tc.input)
        results.append({"type": "tool_result", "tool_use_id": tc.id, "content": output})
    messages.append({"role": "user", "content": results})
```

**\~30 lines minimum.** You own every decision: dispatch, error handling, stop conditions, context management.

### Tradeoff

Maximum control. You can add human review between steps, parallelize tool calls, implement custom retry logic. But you also handle everything that the SDK gives you for free — message management, retries, context window limits.

## Decision guide

| Factor | MCP server | Agent SDK | DIY loop |
|---|---|---|---|
| **You control the workflow?** | No — host decides | Partially — goal + tools | Fully |
| **Runs standalone?** | No — needs a host | Yes | Yes |
| **Boilerplate** | Minimal | Low | Medium |
| **Best for** | Exposing capabilities to existing AI apps | Multi-step autonomous pipelines | Custom orchestration, learning |

## They compose

Agent SDK can consume MCP servers as tool sources. Build question bank tools as MCP once, then orchestrate from Agent SDK or Claude Code:

```python
result = claude_sdk.run(
    model="claude-sonnet-4-6",
    tools=[save_questions],
    mcp_servers=["zettelkasten"],
    prompt="Generate a question bank from my MCP notes"
)
```

---
## References
- [[claude_agent_sdk]]
- [[model_context_protocol]]
- [[custom_mcp_servers]]
- [[llm_tool_use]]
