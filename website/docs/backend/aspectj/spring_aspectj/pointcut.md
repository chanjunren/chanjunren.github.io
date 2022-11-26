# Pointcut
## Declaring a Pointcut
- Only supports join points for Spring beans


```
@Pointcut("execution(* transfer(..))") // pointcut expression
private void anyOldTransfer() {} // pointcut signature
```

| Pointcut Designators   | Description                                                  |
|------------------------|--------------------------------------------------------------|
| `execution`            | Matching execution join points (primary one used)            |
| `within`               | Method within a matching type                                |
| `this`                 | Matching bean reference of given type                        |
| `target`               | Matching target object type                                  |
| `args`                 | Where arguments are of given types                           |
| `@target`              | where class of executing object has annotation of given type |
| `@args`                | where runtime type of arguments match                        |
| `@annotation`          | where subject of join point has given annotation             |
| `bean(idOrNameOfBean)` | Target specific bean                                         |

:::warning
Due to proxy-based nature, only public methods can be intercepted (protected methods cannot be accessed)
:::

```
execution(modifiers-pattern? ret-type-pattern declaring-type-pattern? name-pattern(param-pattern) throws-pattern?)
```


## Examples
| Example                                                            | Description                                                                          |
|--------------------------------------------------------------------|--------------------------------------------------------------------------------------|
| `execution(public * *(..))`                                        | The execution of any public method                                                   |
| `execution(* set*(..))`                                            | The execution of any method beginning with set                                       |   
| `execution(* com.xyz.service.*.*(..))`                             | The execution of any method in the service package                                   | 
| `within(com.xyz.service.*)`                                        | any join point within service package                                                |
| `within(com.xyz.service..*)`                                       | any joint point within service package or sub-package                                |
| `this(com.xyz.service.AccountService`                              | any join point where proxy implements AccountService interface                       |
| `target(com.xyz.service.AccountService`                            | any join point where target implements AccountService interface                      | 
| `args(java.io.Serializable`                                        | any join point which takes a single parameter where runtime argument is Serializable | 
| `@target(org.springframework.transaction.annotation.Transactional` | any join point where the target object has an @Transactional annotation              |
| `@within(org.springframework.transaction.annotation.Transactional` | any join point where declared type of target object @Transactional annotation        |
| `@annotation(...annotation.Transactional`                          | any join point where executing method has @Transactional annotation                 |
| `@args(com.xyz.security.Classified`                                | any join point which takes a single parameter where the runtype has @Classified      |


## Writing good pointcuts
- `Dynamic match` - match cannot be fully formed from static analysis => test will be placed in code to determine if there is actual match
- AspectJ will rewrite it into optimal form for matching process
- Pointcuts ar e written in DNF and the components of the pointcut are sorted such that components that are cheaper to evaluate are evaluated first
- Points to consider for optimal performance of matching
  - How to narrow search space
- Designator Types (Pointcuts)
  - Kinded: select a particular kind of joint (e.g. execution, get, set, call, handler)
  - Scoping: Select a group of join points of interest (e.g. within, withincode)
  - Contextual: maatch and optionally bind based on context(@annotate)

:::note
A well written pointcut should try and include at least the first two types of scoping (kinded and scoping)

Contextual designators may be included if wished to match based on join point context or bind context for use in advice

Supplying either just a kinded designator or just a contextual designator will work but could affect weaving performance

Scoped designators are very fast to match (should include one if possible)
:::



