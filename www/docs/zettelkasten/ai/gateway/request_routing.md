🗓️ 11102026 1520

# llm_gateway_request_routing

A gateway request path separates the application’s stable model interface from the serving system that generates the response.

## One request, two hops

```mermaid
sequenceDiagram
  participant A as Application
  participant G as LiteLLM gateway
  participant V as Ollama or vLLM
  A->>G: Chat completion with alias and gateway credential
  G->>G: Authenticate; apply configured limits
  G->>G: Resolve route and translate request
  G->>V: Provider request with upstream credential
  V->>V: Generate response or propose tool call
  V-->>G: Model response
  G->>G: Translate response; record configured usage
  G-->>A: Compatible response
  Note over A: Application decides whether a proposed tool call may run
```

The gateway may authenticate a key, enforce configured budgets or rate limits, select a route, and translate provider formats. Usage logging can run after the response. These are configuration-dependent gateway features; an OpenAI-compatible endpoint alone does not prove they are enabled.

The two credentials protect different links: the application authenticates to the gateway, and the gateway authenticates to the model server. Keep both out of prompts and tool arguments.

## Stable alias, replaceable model

The application sends a logical model name such as `assistant-default`. The gateway configuration resolves that name to a provider and upstream model. This can let operators change model weights without changing the application, provided the new model and serving configuration remain compatible with the request format and tool-call conventions.

An OpenAI-compatible API describes the request and response shape. It does not guarantee that every model supports every option, structured output, or tool-call behavior in the same way. Test the actual model and serving version for the features the application relies on.

## Tool calls return to the application

A model’s tool-call response is structured data describing a requested function and its arguments. The application validates it against the tools it supplied, authorizes it, executes it, and sends the result in a later model request. The gateway transports these messages; it does not make the decision to execute an application tool.

See [[llm_tool_use]] for the model/application boundary and [MCP tool invocation](../mcp/tool_invocation_flow.md) for the optional external-connector path.

## References

- [LiteLLM request lifecycle](https://docs.litellm.ai/docs/proxy/architecture)
- [vLLM OpenAI-compatible server](https://docs.vllm.ai/en/stable/serving/online_serving/openai_compatible_server/)
- [Tool use with Claude: overview of the interaction pattern](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview)
