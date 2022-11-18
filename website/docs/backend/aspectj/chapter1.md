# Introduction

:::info
Adapted from https://www.eclipse.org/aspectj/doc/released/progguide/starting.html
:::

- Implemented of AOP
- Motivation: Modularization of cross-cutting concerns

## Advantages
- Structure of concern captured explicitly
- Easier to revise changes
- Easy to plug in / out
- Stable implementation


## Development Aspects
- Easily removed from production builds

### Tracing
- For tracing internal workings of program

### Profiling and Logging

### Pre and Post Conditions

### Contract Enforcement
- E.g. only specified methods can be used to add data to a repository 

### Configuration Management

## Production Aspects
:::info
_Property-based_:  

_Name-based_:

:::

### Change Monitoring
- For supporting code that refreshes the display
e.g. indicator for any change

### Context Passing
- e.g. allow client of figure editor to set color of a figure

### Consistent Behavior
- e.g. consistent handling of errors

