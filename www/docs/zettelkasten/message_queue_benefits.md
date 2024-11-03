🗓️ 03112024 1333
📎

# message_queue_benefits
Benefits of Message Queues
In modern cloud architecture, applications are decoupled into smaller, independent building blocks that are easier to develop, deploy and maintain. Message queues provide communication and coordination for these distributed applications.

Message queues can significantly simplify coding of decoupled applications, while improving performance, reliability and scalability. You can also combine message queues with Pub/Sub messaging in a fanout design pattern.  


Better Performance
Message queues enable asynchronous communication, which means that the endpoints that are producing and consuming messages interact with the queue, not each other. Producers can add requests to the queue without waiting for them to be processed. Consumers process messages only when they are available. No component in the system is ever stalled waiting for another, optimizing data flow.


Increased Reliability
Queues make your data persistent, and reduce the errors that happen when different parts of your system go offline. By separating different components with message queues, you create more fault tolerance. If one part of the system is ever unreachable, the other can still continue to interact with the queue. The queue itself can also be mirrored for even more availability.


Granular Scalability
Message queues make it possible to scale precisely where you need to. When workloads peak, multiple instances of your application can all add requests to the queue without risk of collision. As your queues get longer with these incoming requests, you can distribute the workload across a fleet of consumers. Producers, consumers and the queue itself can all grow and shrink on demand.


Simplifed Decoupling
Message queues remove dependencies between components and significantly simplify the coding of decoupled applications. Software components aren’t weighed down with communications code and can instead be designed to perform a discrete business function.

Message queues are an elegantly simple way to decouple distributed systems, whether you're using monolithic applications, microservices or serverless architectures.


Break Up Apps
Use message queues to decouple your monolithic applications. Rather than performing multiple functions within a single executable, multiple programs can exchange information by sending messages between processes, making them easier to test, debug, evolve and scale.

Migrate to Microservices
Microservices integration patterns that are based on events and asynchronous messaging optimize scalability and resiliency. Use message queuing services to coordinate multiple microservices, notify microservices of data changes, or as an event firehose to process IoT, social and real-time data.

Shift to Serverless
Once you've built microservices without servers, deployments onto servers, or installed software of any kind, you can use message queues to provide reliable, scalable serverless notifications, inter-process communications, and visibility of serverless functions and PaaS.

---

# References
- https://aws.amazon.com/message-queue/benefits/