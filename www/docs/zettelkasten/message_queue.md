🗓️ 03112024 1146
📎

# message_queue

```ad-abstract
Message queue is a form of **asynchronous service-to-service communication** used in serverless and microservices architectures
```
- Messages are stored on the queue until they are processed and deleted
- Can simplify coding of decoupled applications, while improving performance, reliability and scalability

## Uses
- Decouple heavyweight processing
- Buffer / batch work
- Smooth spiky workloads

## Basics
- A message queue provides 
	- A lightweight buffer which temporarily stores messages
	- Endpoints that allow software components to connect to the queue in order to send and receive messages
	- The messages are usually small
- Producer: Adds message to queue
- Consumer: retrieves the message

<img src="https://d1.awsstatic.com/product-marketing/Messaging/sqs_seo_queue.1dc710b63346bef869ee34b8a9a76abc014fbfc9.png"/>

## One To One (Point To Point) communication
Many producers and consumers can use the queue, but each message is **processed only once, by a single consumer**

## Pub / Sub messaging in fanout design pattern
When a message needs to be **processed by more than one consumer**, message queues can be combined with Pub/Sub messaging in a fanout design pattern.
 
## Relevant docs
- [[message_queue_benefits]]
- [[message_queue_features]]


---

# References
- https://aws.amazon.com/message-queue/