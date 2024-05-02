🗓️ 20240406 1650
📎 

# protobuf_overview

```ad-tldr
Protocol Buffers (often abbreviated as protobuf) are a language-neutral, platform-neutral, extensible mechanism for serializing structured data
similar to XML, but smaller, faster, and simpler.
```

## Efficiency
- More efficient in terms of serialisation and deserialisation speed compared to other formats like `JSON` or `XML`
- The serialised data is much smaller, which makes it ideal for communication between services or storing data.
## Features
### Language and Platform Neutral
- `Protobuf definitions` are written in a simple configuration file 
	- Can be used to generate code for various programming languages
- Easy to share data across different systems or services, regardless of the languages or platforms they use.
### Strongly Typed
- Strongly typed data structures

### Backward Compatibility
- Can add new fields to your data structures without breaking deployed programs that do not know about them
- Fields can be 
	- Marked as optional or required
	- Deprecated

## Use Cases
- `RPC` when services need to communicate with each other especially in microservices architectures.
- Storing data in a compact format
	- Databases or file systems
- High-performance computing and network communication
## How It Works
1. Define data structure in a .proto file
2. Compile: You use the protobuf compiler protoc to generate code from your .proto file for the programming language you're using
3. Use the generated code to write and read your structured data to and from various data streams
	1. files
	2. pipes
	3. network connections.

--- 
# References
- ChatGPT
