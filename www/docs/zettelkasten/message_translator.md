🗓️ 20240404 1225
📎 #eip

# message_translator

## Background
- Different applications have different proprietary models
- Applications expect to interact with their internal models
- Integration solutions also have their own standardised formats
### Why not just use one format?
- Same format > coupling between systems
- Legacy systems

## Pattern description
```ad-tldr
Have a layer for translating messages between different layers
```
- Can integrate with the `message_endpoint` pattern
- Equivalent to `adapter` pattern in GOF

## Layers
```ad-note
Not very how useful this is but I'm just leaving it here for reference
```
![[message_translator_layers.png]]

--- 
# References
- Enterprise Integration Patterns by Gregor Hohpe, Bobby Woolf
