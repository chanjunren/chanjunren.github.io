🗓️ 03072024 1000
📎 #redis #wip

# redis_mesasge_subscription

> Not so deep dive into `RedisMessageListener`

## Multiplexing
- Use system calls to monitor multiple file descriptors (sockets) simultaneously
- Allows a single thread to efficiently handle input/output operations from various connections without getting blocked on any individual one

## Event Loop
- Continuously checks set of `file descriptors` for incoming data or events
- File descriptor is added for every connected clientWhen a new client connects, a new file descriptor is added to the set being monitored.
- When a client sends a command, the corresponding file descriptor becomes readable, triggering an event.
- When Redis needs to send a reply to a client or a message to a subscriber, the file descriptor becomes writable, triggering another event.

**How It Works for Subscriptions:**

1. When a client subscribes to a channel (or pattern), Redis marks the corresponding file descriptor as needing to receive messages for those channels.
2. Whenever a message is published to a subscribed channel, Redis checks which client connections are interested in that channel.
3. If there are any interested subscribers, Redis marks their file descriptors as writable.
4. In the next iteration of the event loop, Redis writes the message to all the writable file descriptors, effectively delivering it to the subscribers.

**Key Points:**

- Redis's single-threaded nature doesn't limit its ability to handle multiple connections efficiently due to multiplexing and the event loop.
- This design prioritizes high throughput and low latency for most operations, as the single thread avoids context switching and lock contention.
- However, a long-running command can potentially block the entire server, as it has to finish before other commands can be processed.
---

# References
