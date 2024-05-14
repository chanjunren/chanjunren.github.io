---
sidebar_position: 5
sidebar_label: Overview
---

# Overview 
| Adapted from https://docs.spring.io/spring-framework/docs/4.0.x/spring-framework-reference/html/aop.html

## Concepts

| Concept       | Description                                                                                        |
|---------------|----------------------------------------------------------------------------------------------------|
| Aspect        | Modularization of a cross-cutting concern e.g. Transaction management                              |
| Join Point    | A point during the execution of a program                                                          |
| Advice        | Action taken by aspect at a join point                                                             |
| Pointcut      | Predicate that matches joinpoints                                                                  |
| Introduction  | Interfaces for Advices                                                                             |
| Target Object | Object being advised by one or more object                                                         |
| AOP Proxy     | Object created by AOP framework to implement contracts (JDK Dynamic Proxy / CGLib Proxy in Spring) |
| Weaving       | Linking aspects with other application types to create advised object                              |

## Advice

| Advice          | When it is executed                                     |
|-----------------|---------------------------------------------------------|
| Before          | Before a JP (cannot stop execution unless error thrown) |
| After Return    | After JP completes normally                             |
| After Throwing  | After method exits by throwing an exception             |
| After (finally) | After method exits (regardless of how)                  |
| Around          | Advice that surrounds a joinpoint during execution      |

:::note
Recommended to use the least powerful advice required for implementing an aspect => simpler model will have less potential for errors
:::

## AOP Proxies
- (Default) Standard JDK dynamic proxies - for interface
- CGLib Proxies - for classes 
- [Further Reading](https://docs.spring.io/spring-framework/docs/4.0.x/spring-framework-reference/html/aop.html#aop-understanding-aop-proxies)

:::note
It is good practise to use interfaces rather than classes as business class normally implements one or more interfaces
:::

---

# @AspectJ Support

## Enabling AspectJ Support
```
@Configuration
@EnableAspectJAutoProxy
public class AppConfig{}
```

## Declaring an Aspect
- Aspects cannot target other aspects
- Register Aspect as a bean with @Component

```
@Aspect
public class someAspect {
}
```

:::warning
Not sufficient to just use @Aspect for component scanning, also need @Component

Not possible to target Aspects of advise from other aspects
:::