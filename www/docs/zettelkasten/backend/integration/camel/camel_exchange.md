🗓️ 17052024 1125

# camel_exchange

## Exchange

- Passed between different `Processors` or `Components` in a Camel route.
- Stores **Messages** and **Properties**

> Container holding the entire message within the camel route

## Headers

Message metadata (e.g. content type or authentication details)

> Often for controlling routing logic or to configure how specific components in a route should behave

## Body

Contains the actual payload or data of the message

## Messages

> Camel supports a message model with an `IN` message and an optional `OUT` message.

### IN Message

Default message containing data processed by the route

> Analogous to request in a request/response communication pattern.

### OUT Message

Only when there is a need to maintain a separate response message that is distinct from the `IN` message

> In many integration patterns, only the `IN` message is used, and it is transformed as it passes through the route.

```ad-note
 If an `OUT` message is used, it effectively replaces the `IN` message at that stage of processing, making the `IN` message no longer accessible unless explicitly copied over

- Shoould only be created if there is a clear requirement to keep the original `IN` message unchanged throughout the processing pipeline


- Allowing you to have access to both the original message and the response or result at the end of the processing


```

## Properties

- For holding information that needs to be **retained throughout the processing of an entire Exchange** across any number of routes and transformations
- Used internally
  - Control behaviour
  - Maintain state

### Practical Usage

- **Properties**: Use them for metadata that is relevant across multiple stages of your route, where the information does not need to be sent to external systems but is crucial for the internal decision-making processes or state tracking.
- **IN Headers**: Typically used to influence or configure the behavior of components within a route, such as setting API keys, content types, or routing criteria.
- **IN Body**: The main data payload, which is processed and transformed by various components and processors in your route.

---

## References

- ChatGPT
- https://camel.apache.org/manual/exchange.html
- https://camel.apache.org/manual/exchange-pooling.html
- https://camel.apache.org/manual/exchange.html
