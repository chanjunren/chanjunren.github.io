🗓️ 11102026 1520

# gateway

An **LLM gateway** gives applications one endpoint for model requests. It maps a stable model alias to a provider and translates request formats.

## Stable alias, replaceable backend

```text
application → gateway → selected model server
```

For example, `assistant-default` can target Ollama locally and vLLM in production. Client code stays stable if both backends support the required features.

Authentication, budgets, retries, and usage records depend on configuration. The gateway receives prompts and upstream credentials, so its access and retention policies matter.

## Reading path

1. [[request_routing]]: follow one request through both hops.
2. [[gateway_operations]]: configure, protect, and verify those hops.

[[llm_tool_use]] explains how the application handles returned tool proposals.

## References

- [LiteLLM request lifecycle](https://docs.litellm.ai/docs/proxy/architecture)
- [LiteLLM routing](https://docs.litellm.ai/docs/routing)
