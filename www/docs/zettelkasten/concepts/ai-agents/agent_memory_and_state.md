🗓️ 21032026 2100

# agent_memory_and_state

> How agents retain, retrieve, and manage information across interactions to maintain coherent behavior over time

## Why Agents Need Memory

Without memory, every LLM call is stateless — the agent has no context beyond what's in the current prompt. Memory enables agents to:

- **Maintain context** across multi-step tasks (remembering what's been done)
- **Learn from past interactions** (avoiding repeated mistakes)
- **Personalize behavior** (adapting to user preferences)
- **Coordinate with other agents** (sharing discovered information)

## Types of Memory

| Type | What It Stores | Lifespan | Storage Approach |
|---|---|---|---|
| **Short-term** | Current conversation / task context | Single session | Context window (message history) |
| **Long-term** | Facts, preferences, learned knowledge | Persistent | Vector DB, key-value store, file system |
| **Episodic** | Specific past interactions and outcomes | Persistent | Structured logs, indexed by time/task |

### Short-term Memory

The simplest form — just the conversation history passed in the LLM's context window. Effective but limited by token count. Strategies to manage it:

- **Sliding window**: keep the last N messages
- **Summarization**: periodically compress older messages into a summary
- **Selective retention**: keep messages marked as important, drop the rest

### Long-term Memory

Persistent knowledge that survives across sessions. Typically involves:

- **Embedding + vector search**: store information as vectors, retrieve by semantic similarity
- **Structured storage**: key-value pairs, relational DB for structured facts
- **File-based**: markdown files, JSON — simple but effective for smaller knowledge bases

### Episodic Memory

Records of what happened in specific past interactions — useful for learning from experience:

- What task was attempted and what approach was taken
- Whether the approach succeeded or failed
- What the user's feedback was

## State Management Approaches

| Approach | How It Works | Best For |
|---|---|---|
| **Centralized** | Single state store shared by all agents | [[coordinator_router_pattern]], simpler multi-agent setups |
| **Distributed** | Each agent maintains its own state | Loosely coupled agents, parallel execution |
| **External** | State stored in external system (DB, cache) | Production systems, persistence across restarts |

## How Memory Affects Pattern Selection

| Pattern | Memory Considerations |
|---|---|
| **Single agent** | Short-term context usually sufficient |
| **[[coordinator_router_pattern]]** | Coordinator needs memory of subtask results; sub-agents may be stateless |
| **[[agent_as_tool_pattern]]** | Primary agent holds all state; sub-agent tools are deliberately stateless |
| **[[loop_review_critique_pattern]]** | Needs memory of previous iterations to avoid repeating the same fixes |

## Practical Considerations

| Concern | Detail |
|---|---|
| **Token limits** | Context window is finite — aggressive summarization or retrieval needed for long tasks |
| **Retrieval quality** | Vector search isn't perfect — irrelevant memories can mislead the agent |
| **Staleness** | Stored facts can become outdated — need expiration or validation strategies |
| **Cost** | Every memory retrieved and injected into context costs tokens |
| **Privacy** | Persistent memory may store sensitive information — consider retention policies |

---
## References
- [[agentic_design_patterns]]
- [[agent_as_tool_pattern]]
- [[coordinator_router_pattern]]
- [MemGPT: Towards LLMs as Operating Systems (arXiv)](https://arxiv.org/abs/2310.08560)
- [LangChain Memory Documentation](https://python.langchain.com/docs/concepts/memory/)
- [LlamaIndex Agent Memory](https://docs.llamaindex.ai/en/stable/understanding/agent/memory/)
- [LLM Powered Autonomous Agents — Lilian Weng](https://lilianweng.github.io/posts/2023-06-23-agent/)
