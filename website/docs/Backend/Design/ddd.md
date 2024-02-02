---
sidebar_position: 1
sidebar_label: Domain Driven Design
---

# Domain-Driven Design
> Domain-Driven Design is an approach to software development that centers on the business domain, its elements, and their interactions
>
> It advocates modeling based on the reality of business as relevant to your use cases

## When to use
- Dealing with complex business processes / domains
- Large teams with multiple teams, where a common language / understanding is crucial
- Business rules and logic are complex and central to application functionality

## Core Layers

### Domain Layer
> The Domain layer is the heart of your business logic
>
> It represents the business concepts, rules, and logic specific to the problem domain your application is addressing

| Components      | Description                                                                                                                                                                |
|-----------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Entities        | Objects that have a distinct identity that runs through time and different states                                                                                          |
| Value Objects   | Objects that describe some characteristic or attribute but are not defined by a unique identity and are typically immutable                                                |
| Aggregates      | <ul><li>A cluster of domain objects (entities and value objects) that are treated as a single unit for data changes</li><li>Each aggregate has a root and a boundary </li></ul> |
| Domain Services | Operations that belong to the domain model but don’t naturally fit within a domain entity or value object                                                                  |
| Domain Events   | Events that are significant within the domain                                                                                                                              |

### Application Layer
> The Application layer serves as a coordination layer, orchestrating the flow of data and the sequence of operations in the application
>
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