🗓️ 21032026 2100

# ai_systems_learning_roadmap

> A structured reading and learning plan progressing from LLM fundamentals to building custom AI tool implementations

## Phase 1: Foundations

**Goal**: understand how LLMs work and how they interact with tools

| Resource | Type | Link |
|---|---|---|
| Andrej Karpathy — "Intro to Large Language Models" | Video | [YouTube](https://www.youtube.com/watch?v=zjkBMFhNj_g) |
| Anthropic — Tool Use Documentation | Docs | [docs.anthropic.com](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview) |
| OpenAI — Function Calling Guide | Docs | [platform.openai.com](https://platform.openai.com/docs/guides/function-calling) |

Zettelkasten: [[llm_tool_use]]

## Phase 2: Agent Patterns

**Goal**: learn how agents are architected and when to use which pattern

| Resource | Type | Link |
|---|---|---|
| Lilian Weng — "LLM Powered Autonomous Agents" | Blog | [lilianweng.github.io](https://lilianweng.github.io/posts/2023-06-23-agent/) |
| Andrew Ng — Agentic Design Patterns (DeepLearning.AI) | Video | [deeplearning.ai](https://www.deeplearning.ai/the-batch/how-agents-can-improve-llm-performance/) |
| Anthropic — "Building Effective Agents" | Blog | [anthropic.com](https://www.anthropic.com/engineering/building-effective-agents) |

Zettelkasten: [[agentic_design_patterns]], [[agent_memory_and_state]]

## Phase 3: MCP & Tool Infrastructure

**Goal**: understand the protocol layer that connects agents to tools at scale

| Resource | Type | Link |
|---|---|---|
| MCP Official Documentation | Docs | [modelcontextprotocol.io](https://modelcontextprotocol.io/introduction) |
| MCP Quickstart — Building a Server | Tutorial | [modelcontextprotocol.io](https://modelcontextprotocol.io/quickstart/server) |
| MCP Quickstart — Building a Client | Tutorial | [modelcontextprotocol.io](https://modelcontextprotocol.io/quickstart/client) |

Zettelkasten: [[model_context_protocol]], [[custom_mcp_servers]]

## Phase 4: Build Your Own

**Goal**: hands-on implementation to solidify understanding

| Project | Description | Starting Point |
|---|---|---|
| **Custom MCP Server** | Expose an internal API or database via MCP. Start with stdio transport, then add HTTP | [MCP Server Quickstart](https://modelcontextprotocol.io/quickstart/server) |
| **Agent with Tool Use** | Build an agent that uses tools to accomplish a multi-step task | [Anthropic SDK](https://docs.anthropic.com/en/docs/build-with-claude/tool-use/overview), [LangChain Agents](https://python.langchain.com/docs/concepts/agents/), [LlamaIndex Agents](https://docs.llamaindex.ai/en/stable/understanding/agent/) |
| **Multi-Agent System** | Combine multiple agents using your custom MCP tools — try coordinator or agent-as-tool pattern | [[coordinator_router_pattern]], [[agent_as_tool_pattern]] |

## Phase 5: Advanced Topics

**Goal**: deeper exploration for production-grade systems

| Topic | What to Explore |
|---|---|
| **RAG (Retrieval-Augmented Generation)** | Embedding models, vector databases, chunking strategies, hybrid search |
| **Agent Evaluation & Observability** | Tracing agent runs, measuring tool call accuracy, detecting loops/hallucinations |
| **Production Concerns** | Guardrails, cost management, latency optimization, rate limiting, error recovery |

---
## References
- [[llm_tool_use]]
- [[agentic_design_patterns]]
- [[agent_memory_and_state]]
- [[model_context_protocol]]
- [[custom_mcp_servers]]
- [Andrej Karpathy — Intro to Large Language Models (YouTube)](https://www.youtube.com/watch?v=zjkBMFhNj_g)
- [Lilian Weng — LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
- [Anthropic — Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)
- [MCP Official Documentation](https://modelcontextprotocol.io/introduction)
