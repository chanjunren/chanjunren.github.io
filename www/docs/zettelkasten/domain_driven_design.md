🗓️ 06112024 0031
📎

# domain_driven_design
```ad-abstract
An **approach to software development** that centers on the **business domain**'s elements and interactions 

It advocates modeling based on the reality of business as relevant to your use cases
```

## When to use
- Dealing with complex business processes / domains
- Large teams with multiple teams, where a common language / understanding is crucial
- Business rules and logic are complex and central to application functionality


```text
/
├── {domain-name}/                
│   ├── domain/
│   │   ├── model/            # Domain models
│   │   │   ├── po/           # Domain entities (Persistent Objects)
│   │   │   └── vo/           # Value Objects (domain-specific immutable objects)
│   │   ├── repository/       # Repository interfaces
│   │   ├── event/            # Domain events
│   │   ├── enums/            # Domain-specific enums 
│   │   └── constants/        # Domain-specific constants 
│   │
│   ├── application/          # Business workflows & data access
│   │   ├── dto/              # Application layer DTOs
│   │   │   ├── request/      # API request DTOs
│   │   │   └── response/     # API response DTOs
│   │   ├── bo/               # Business Objects (application layer business logic)
│   │   ├── {Domain}DataProvider.java       # Main service interface
│   │   └── impl/
│   │       ├── {Domain}DataSourceImpl.java # Main orchestrator
│   │       ├── {Domain}DataProviderV1.java # Implementation variant 1
│   │       └── {Domain}DataProviderV2.java # Implementation variant 2
│   │
│   └── infrastructure/       # Technical implementations
│       ├── persistence/      # Database mappers (ORM mappers, etc.)
│       │   └── dto/          # Database/persistence DTOs (ResultMaps, projections)
│       └── messaging/        # External messaging (Message queues, etc.)
│           └── dto/          # External messaging DTOs
│               ├── request/  # Outbound message DTOs
│               └── response/ # Inbound message DTOs{}
```

## Core Layers

### Domain Layer
Heart of your business logic, represents
- Business concepts
- Rules
- Logic specific to problem domain

| Components      | Description                                                                                                                                                                     |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Entities        | Objects that have a distinct identity that runs through time and different states                                                                                               |
| Value Objects   | Objects that describe some characteristic or attribute but are not defined by a unique identity and are typically immutable                                                     |
| Aggregates      | <ul><li>A cluster of domain objects (entities and value objects) that are treated as a single unit for data changes</li><li>Each aggregate has a root and a boundary </li></ul> |
| Domain Services | Operations that belong to the domain model but don’t naturally fit within a domain entity or value object                                                                       |
| Domain Events   | Events that are significant within the domain                                                                                                                                   |

### Application Layer
Coordination layer
- Orchestrating the flow of data 
- Sequence of operations in the application

> It is concerned with the application's overall workflow but not with business rules or domain logic

| Component                                        | Description                                                                                                                                                                                         |
|--------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Application Services                             | <ul><li>These services orchestrate domain objects to perform tasks</li><li>They don't contain business logic themselves but coordinate domain layer objects to perform the business logic</li></ul> |
| DTO                                              | Objects that carry data between processes, often used to encapsulate the data that is transferred over the network                                                                                  |
| API interfaces                                   | Interfaces that define the operations available to external clients                                                                                                                                 |
| Command, Query Responsibility Segregation (CQRS) | Separating the read (query) operations from the write (command) operations can be implemented in this layer                                                                                         |

### Infrastructure Layer
- Implements functionality required by domain layer (persistence)
- **Data Access**
- Integration with external services

## Dump
- Domain Services are called by Application Services, never the other way around. The dependency flows: Application → Domain → Infrastructure.


---

# References
