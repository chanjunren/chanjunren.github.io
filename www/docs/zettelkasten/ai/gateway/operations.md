🗓️ 11102026 1520

# operations

Operating a **gateway** means managing the route from application to model server. Verify each hop independently.

## Configuration ownership

| Component | Settings |
|---|---|
| Application | Gateway URL, model alias, scoped gateway key |
| Gateway | Alias mapping, upstream URL/key, limits, retention |
| Model server | Model weights, serving options, capacity |

Deploying the gateway does not deploy the model. Separate releases when their lifecycles differ. Pin image versions and keep credentials in a secret store, outside images and model context.

Inside a container, `localhost` points to that container. A host model server needs a reachable host address. Protect remote connections with authentication and TLS; restrict network access where possible.

## Verification and failures

- Check gateway health, then make an upstream inference request.
- Test tool-call parsing against the chosen serving version.
- Set deadlines, retry bounds, usage limits, and retention rules.
- Monitor latency, failures, capacity, and usage; exclude secrets.

Gateway health proves process responsiveness, not upstream inference. Retrying inference differs from replaying an agent turn: replay can repeat writes. See [[tool_invocation_flow]] for tool retries.

## References

- [LiteLLM production best practices](https://docs.litellm.ai/docs/proxy/prod)
- [LiteLLM virtual keys](https://docs.litellm.ai/docs/proxy/virtual_keys)
- [vLLM OpenAI-compatible server](https://docs.vllm.ai/en/stable/serving/online_serving/openai_compatible_server/)
