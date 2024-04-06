20240404 1212

Tags: #eip

# message_endpoint

## Problem background
-  Applications communicate by sending `messages` through a `Message Channels`
-  `Sender` / `Receiver` / `Messaging systems` are separate - need a way to connect and work together

## Pattern description
![[eip_message_endpoint.png]]
```ad-tldr
Basically an interface for
	- Sender to convert data into a suitable format for the `Messaging system`
	- Receiver to convert data from `Messaging system`
	- Encapsulates `Messaging system` interaction logic from the rest of application
```

## Benefits
- _Flexible_: Easier to switch messaging systems when necessary
- _Maintainable_: By encapsulating this logic, system is easier to understand and maintain
- ...
--- 
# References
- Enterprise Integration Patterns by Gregor Hohpe, Bobby Woolf