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

## Declaring a Pointcut
- Only supports join points for Spring beans


```
@Pointcut("execution(* transfer(..))") // pointcut expression
private void anyOldTransfer() {} // pointcut signature
```

| Pointcut Designators | Description |
| - | - | 
| `execution` | Matching execution join points (primary one used) |
| `within` | Method within a matching type |
| `this` | Matching bean reference of given type |
| `target` | Matching target object type |
| `args` | Where arguments are of given types |
|`@target`| where class of executing object has annotation of given type |
|`@args`| where runtime type of arguments match |
|`@annotation` | where subject of join point has given annotation |

:::warning
Due to proxy-based nature, only public methods can be intercepted (protected methods cannot be accessed)
:::



