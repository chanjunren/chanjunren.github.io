🗓️ 03112024 1333
📎

# message_queue_benefits

```ad-abstract
Message queues provide communication and coordination for these distributed applications
```

## Better Performance
- MQs enable asynchronous communication
- Reduces stalling / waiting
## Increased Reliability
- Makes data persistent
- Reduce the errors that happen when different parts of your system go offline and hence increases **fault tolerance**

## Granular Scalability
- Allow for scaling where needed
> Can scale consumers / producers / queue itself if necessary
- Requests can be added to the queue without risk of collisions

## Simplifed Decoupling
- remove dependencies between components 
- Significantly simplify the coding of decoupled applications

## Break Up Apps
- Can be used to decouple your monolithic applications

```ad-info
Rather than performing multiple functions within a single executable, multiple programs can exchange information by sending messages between processes, making them easier to test, debug, evolve and scale
```


## Migrate to Microservices
- Microservices integration patterns that are based on events and asynchronous messaging optimize **scalability** and **resiliency**
- MQ services can coordinate multiple microservices, notify microservices of data changes, or as an event firehose to process IoT, social and real-time data.

## Shift to Serverless
Once you've built microservices without servers, deployments onto servers, or installed software of any kind, you can use message queues to provide reliable, scalable serverless notifications, inter-process communications, and visibility of serverless functions and PaaS.

---

# References
- https://aws.amazon.com/message-queue/benefits/