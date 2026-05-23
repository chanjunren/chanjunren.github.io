🗓️ 21032026 2100

# agent_memory_and_state

> Without memory every LLM call starts from zero — memory lets agents retain context, learn from past interactions, and stay coherent across steps

## Three types of memory

| Type | What it stores | Lifespan | Concrete example |
|---|---|---|---|
| **Short-term** | Current conversation context | Single session | Claude Code's message history in one conversation |
| **Long-term** | Facts, preferences, knowledge | Persistent | Claude Code's `~/.claude/memory/` files — remembered across sessions |
| **Episodic** | Records of past interactions | Persistent | "Last time I refactored auth, the user preferred one bundled PR" |

### Short-term memory

The conversation history in the context window. Simple, but limited by token count.

Strategies when it fills up:
- **Sliding window** — keep last N messages, drop oldest
- **Summarization** — compress older messages into a summary (Claude Code does this automatically)
- **Selective retention** — keep important messages, drop routine ones

### Long-term memory

Persists across sessions. Three storage approaches:

- **Embeddings + vector search** — store as vectors, retrieve by semantic similarity. Good for large knowledge bases (1000+ items).
- **Structured storage** — key-value pairs or relational DB. Good for facts with clear schema (user preferences, entity attributes).
- **File-based** — markdown files, JSON. Simple, human-readable. Good for \<500 items. Claude Code's memory system uses this.

### Episodic memory

Records what happened in past interactions — what was tried, whether it worked, what the user said. Enables learning from experience:

- "User prefers integration tests over mocks — got burned by mock/prod divergence"
- "Last ETL pipeline fix: root cause was timezone mismatch in date filter, not missing data"

## State management in multi-agent systems

| Approach | How it works | When |
|---|---|---|
| **Centralized** | Single state store, all agents read/write | [[coordinator_router_pattern]] — coordinator tracks subtask results |
| **Distributed** | Each agent has own state | Loosely coupled agents running in parallel |
| **External** | State in DB or cache | Production systems that need persistence across restarts |

## Memory affects pattern choice

| Pattern | Memory needs |
|---|---|
| **Single agent** | Short-term context usually enough |
| **[[coordinator_router_pattern]]** | Coordinator remembers subtask results; sub-agents are stateless |
| **[[agent_as_tool_pattern]]** | Primary holds all state; sub-agents deliberately stateless |
| **[[loop_review_critique_pattern]]** | Must remember previous iterations to avoid repeating same fixes |

## Practical trade-offs

- **Token cost** — every retrieved memory injected into context costs tokens
- **Retrieval quality** — vector search returns irrelevant results sometimes; can mislead the agent
- **Staleness** — stored facts go stale. A memory saying "auth uses JWT" may be wrong after a migration. Validate before acting.
- **Privacy** — persistent memory may store sensitive data. Consider retention policies.

---
## References
- [[agentic_design_patterns]]
- [MemGPT: Towards LLMs as Operating Systems (arXiv)](https://arxiv.org/abs/2310.08560)
- [LLM Powered Autonomous Agents — Lilian Weng](https://lilianweng.github.io/posts/2023-06-23-agent/)
