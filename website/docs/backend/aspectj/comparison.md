# Spring AOP vs AspectJ

## Considerations
- Compatibility with project
- Overhead
- How quickly can it be integrated 
- Where can it be implemented

## Concepts


| Term           | Definition                                                                       |
|----------------|----------------------------------------------------------------------------------|
| Aspect         | Standard / reusable code piece / feature                                         |
| Joinpoint      | Particular point of execution (method execution, constructor / field assignment) |
| Advice         | Action taken by aspect in specific joinpoint                                     |
| Pointcut       | Regex that matches joinpoint                                                     |
| Weaving        | process of linking aspects with targeted objects                                 |
| Advised Object | Generated object after weaving                                                   |


## Capabilities and Goals
| Spring AOP       | Aspect J                                   |
|------------------|--------------------------------------------|
| Simple           | More complete (but complicated)            |
| Run-time weaving | Compile / Post-Compile / Load-time weaving |
|                  | Better performance                         |


:::info
_Compile-time weaving_: (Source code, aspect) => woven class files

_Post-compile (binary) weaving_: Weave existing class files

_Load-time weaving_: Similar to post-compile, only done when loaded into JVM
:::

