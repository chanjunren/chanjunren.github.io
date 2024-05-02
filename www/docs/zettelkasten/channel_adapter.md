🗓️ 20240405 1232
📎  #eip

# channel_adapter

## Background
- Problem: connecting an application to **send** / **receive** messages

![[eip_channel_adapter.png]]

## Pattern
```ad-tldr
Use a Channel Adapter to decouple logic for interacting with a `messageChannel`
```

```ad-quote

### Example: Stock Trading 
- A stock trading system may wish to keep a log of all of a stock's prices in a database table
- **Channel-to-RDBMS**
	- relational database adapter that logs each message from a channel to a specified table and schema 
- **Internet-to-channel adapter**
	- The system may also be able to:
		- Recieve external quote requests from the Internet (TCP/IP or HTTP)
		- Send them on its internal quote-request channel with the internal quote requests
	
### Example: Commercial EAI Tools 
- Commercial EAI vendors provide a collection of Channel Adapters as part of their offerings
- Having adapters to all **major application packages** available simplifies development of an integration solution greatly
- Most vendors also provide more **generic database adapters** as well as software development kits (SDK's) to develop custom adapters
 
 
### Example: Legacy Platform Adapters 
- A number of vendors provide adapters from common messaging system to legacy systems executing on platforms such as as UNIX, MVS, OS/2, AS/400, Unisys, and VMS
- Most of these adapters are specific to a certain messaging system
- For example, Envoy Technologies' `EnvoyMQ` is a Channel Adapter that connects many legacy platforms with MSMQ
	- Components:
		- Client that runs on the legacy computer 
		- Server that runs on a Windows computer with MSMQ
```


--- 
# References
- Enterprise Integration Patterns by Gregor Hohpe, Bobby Woolf