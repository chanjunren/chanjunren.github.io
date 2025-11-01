🗓️ 03112024 1334

# message_queue_features

```ad-abstract
Building applications from individual components that each perform a discrete function is a best practice that improves scalability and reliability

Using message queues, you can send, store, and receive messages between application components at any volume, without losing messages or requiring other services to be always available.
```


## Push or Pull Delivery
Different options for receiving messages
	- **Pull** - continuously querying the queue for new messages
	- **Push** - a consumer is notified when a message is available (Pub/Sub messaging)

```ad-note
Long-polling allows pulls to wait a specified amount of time for new messages to arrive before completing.
```


## Schedule or Delay Delivery
Support for setting a specific delivery time for a message

```ad-note
Can use a `delayQueue` if a common delay is required for all messages
```

## At-Least-Once Delivery
- MQs store multiple copies of a single message for **redundancy** and **high availability**
- Support for resend messages in the event of 
	- Communication failures 
	- Errors to ensure they are delivered at least once.

## Exactly-Once Delivery
When duplicates can't be tolerated, FIFO (first-in-first-out) message queues will make sure that each message is delivered exactly once (and only once) by filtering out duplicates automatically.

## FIFO (First-In-First-Out) Queues
Oldest message processed first

## Dead-letter Queues
A dead-letter queue is a queue to which other queues can send messages that can't be processed successfully. This makes it easy to set them aside for further inspection without blocking the queue processing or spending CPU cycles on a message that might never be consumed successfully.

## Ordering
- Most message queues provide **best-effort ordering** 
- Ensures that messages are generally delivered in the same order as they're sent

## Poison-pill Messages
- Poison pills are special messages that **can be received, but not processed**
- Mechanism used in order t**o signal a consumer to end its work** so it is no longer waiting for new inputs
- Similar to closing a socket in a client/server model.

## Security
**Authentication** for applications accessing the queue / **encryption** of messages

---

## References
- https://aws.amazon.com/message-queue/features/