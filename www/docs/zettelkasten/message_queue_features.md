🗓️ 03112024 1334
📎

# message_queue_features
Features of Message Queues
Building applications from individual components that each perform a discrete function is a best practice that improves scalability and reliability. Using message queues, you can send, store, and receive messages between application components at any volume, without losing messages or requiring other services to be always available.

Message queues offer several options that allow you to specify how messages are delivered and secured, described here. Queues can also be combined with Pub/Sub messaging in a fanout design pattern.

Push or Pull Delivery
Most message queues provide both push and pull options for retrieving messages. Pull means continuously querying the queue for new messages. Push means that a consumer is notified when a message is available (this is also called Pub/Sub messaging). You can also use long-polling to allow pulls to wait a specified amount of time for new messages to arrive before completing.

Schedule or Delay Delivery
Many message queues support setting a specific delivery time for a message. If you need to have a common delay for all messages, you can set up a delay queue.

At-Least-Once Delivery
Message queues may store multiple copies of messages for redundancy and high availability, and resend messages in the event of communication failures or errors to ensure they are delivered at least once.

Exactly-Once Delivery
When duplicates can't be tolerated, FIFO (first-in-first-out) message queues will make sure that each message is delivered exactly once (and only once) by filtering out duplicates automatically.

FIFO (First-In-First-Out) Queues
In these queues the oldest (or first) entry, sometimes called the “head” of the queue, is processed first. To learn more about Amazon SQS FIFO queues, refer to the Developer Guide.

You can also read our blogs: Using Python and Amazon SQS FIFO Queues to Preserve Message Sequencing, How the Amazon SQS FIFO API Works, and, FIFO Queues with Exactly-Once Processing & Deduplication.

Dead-letter Queues
A dead-letter queue is a queue to which other queues can send messages that can't be processed successfully. This makes it easy to set them aside for further inspection without blocking the queue processing or spending CPU cycles on a message that might never be consumed successfully.

To learn more about dead-letter queues, read our blog, Using Amazon SQS Dead-Letter Queues to Control Message Failure. To learn how to use dead-letter queues in Amazon SQS, see our Developer Guide.

Ordering
Most message queues provide best-effort ordering which ensures that messages are generally delivered in the same order as they're sent, and that a message is delivered at least once.

Poison-pill Messages
Poison pills are special messages that can be received, but not processed. They are a mechanism used in order to signal a consumer to end its work so it is no longer waiting for new inputs, and is similar to closing a socket in a client/server model.

Security
Message queues will authenticate applications that try to access the queue, and allow you to use encryption to encrypt messages over the network as well as in the queue itself. To learn more about queue security on AWS, read our blog, Server-Side Encryption for Amazon Simple Queue Service (SQS). You can also learn more about the security features of Amazon SQS in our Developer Guide.

---

# References
- https://aws.amazon.com/message-queue/features/