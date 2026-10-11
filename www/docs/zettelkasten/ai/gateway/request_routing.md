🗓️ 11102026 1520

# request_routing

**Request routing** maps the application's model alias to a serving backend and carries the response back.

## One request, two hops

```mermaid
sequenceDiagram
  participant A as Application
  participant G as LiteLLM gateway
  participant V as Ollama or vLLM
  A->>G: Model alias and gateway credential
  G->>G: Check access, resolve route, translate request
  G->>V: Request and configured upstream credential
  V-->>G: Model response
  G-->>A: Translated response
```

The application uses a gateway key. The gateway separately supplies any upstream credential. Keep both outside prompts and tool arguments; configure limits and usage recording explicitly.

## Compatibility and tool calls

OpenAI-compatible APIs share request shapes, not identical feature support. Test options, structured output, and tool calls before switching backends.

A returned tool call goes back to the application for validation and execution. The result becomes input to the next model turn; [[tool_invocation_flow]] traces the optional MCP path.

## References

- [LiteLLM request lifecycle](https://docs.litellm.ai/docs/proxy/architecture)
- [vLLM OpenAI-compatible server](https://docs.vllm.ai/en/stable/serving/online_serving/openai_compatible_server/)
