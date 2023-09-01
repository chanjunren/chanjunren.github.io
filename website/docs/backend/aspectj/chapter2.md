---
sidebar_position: 1
sidebar_label: Chapter 2
---
# AspectJ Language

:::info
Adapted from https://www.eclipse.org/aspectj/doc/released/progguide/language.html
:::

## Anatomy
```
 1 aspect FaultHandler {
 2
 3   private boolean Server.disabled = false;
 4
 5   private void reportFault() {
 6     System.out.println("Failure! Please fix it.");
 7   }
 8
 9   public static void fixServer(Server s) {
10     s.disabled = false;
11   }
12
13   pointcut services(Server s): target(s) && call(public * *(..));
14
15   before(Server s): services(s) {
16     if (s.disabled) throw new DisabledException();
17   }
18
19   after(Server s) throwing (FaultException e): services(s) {
20     s.disabled = true;
21     reportFault();
22   }
23 }
```

| Term     | Definition                                                           | 
|----------|----------------------------------------------------------------------|
| Pointcut | Picks out join points (points in execution of prg)                   |
| Advice   | Brings tgt pointcut and body of code to define aspect implementation |

## Examples
| Scenario                                                          | Syntax                               |
|-------------------------------------------------------------------|--------------------------------------|
| particular method body execution                                  | `execution(void Point.setX(int))`    |
| method is called                                                  | `call(void Point.setX(int))`         |
| exception handler executed                                        | `handler(ArrayOutOfBoundsException)` |
| object executing is of `someType`                                 | `this(SomeType)`                     |
| executing code belongs to `SomeClass`                             | `within(SomeClass)`                  |
| join point in control flow of call to a `Test`'s no-argument main | `cflow(call(void Test.main()))`       |


### Composing pointcuts
| Description                                                                                   | Syntax                                               |
|-----------------------------------------------------------------------------------------------|------------------------------------------------------|
| Any call to int method on `Point` instance regardless of name                                 | `target(Point) && call(int *())`                     |
| Any call to any method where the call is made from within `Point` or `Line`                   | `call(* *(..)) && (within(Line) \|\| within(Point))` |
| execution of any constructor taking exactly one int argument regardless of where call is from | `within(*) && execution(*.new(int))`                 |
| any method call to `int` method when executing object is any type except `Point`              | `!this(Point) && call(int *(..))`                    |


### Wildcards
| Description                                                    | Syntax               |
|----------------------------------------------------------------|----------------------|
| Execution of any method regardless of return / parameter type  | `execution(* *(..))` |
| Call to any `set` method regardless of return / parameter type | `call(* set(..))`    |

### Based on Constructors / Modifiers
| Description                                     | Syntax                              |
|-------------------------------------------------|-------------------------------------|
| call to any public method                       | `call(public * *(..))`              |
| execution of non-static method                  | `execution(`!static * *(..))`       |
| any execution of public non static method       | `execution(public !static * *(..))` |
| any call to method in `MyInterface`'s signature | `call(* MyInterface.*(..))`         |

## Call Vs Execution
:::note
When methods and constructors run, there are 2 times associated - when they are called / when they actually execute 
:::

| `call` pointcuts                                                                                                                   | `execution` pointcuts                                                                                               |
|------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| enclosing code is that of call site <br/> i.e. `call(void m()) && withincode(void m())` will only capture directly recursive calls | enclosing code is the method itself <br/> i.e. `execution(void m()) && withincode(void m()) == execution(void m())` |
| does not capture super calls to non static methods                                                                                 |                                                                                                                     |
| use when targeting when a particular signature is called                                                                           | use when actual peice of code runs                                                                                  |

## Pointcut Compositions
- Use primitive pointcuts to build more powerful pointcuts
