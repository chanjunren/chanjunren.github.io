🗓️ 06062026 2100

# deep_vs_shallow_modules

John Ousterhout's central design principle: a module's value is the ratio of functionality it provides to the complexity of its interface. **Deep modules** hide significant implementation behind a simple interface. **Shallow modules** expose nearly as much complexity as they contain — they cost more to learn than they save.

## Why depth matters

- Every interface a developer must learn adds **cognitive load**
- A deep module absorbs complexity — callers don't need to know how it works
- A shallow module just moves complexity around without reducing it

## Deep module

Large implementation, small interface. The caller gets powerful behavior for minimal learning cost.

**Unix file I/O** is the canonical example — 5 functions (`open`, `read`, `write`, `lseek`, `close`) hide hundreds of thousands of lines handling disk drivers, caching, file systems, and permissions.

```
┌──────────────────────────┐
│     small interface      │  ← what callers see
├──────────────────────────┤
│                          │
│                          │
│  large implementation    │  ← what the module handles
│                          │
│                          │
└──────────────────────────┘
```

## Shallow module

Little functionality or a complicated interface that adds more complexity than it hides.

```
┌──────────────────────────┐
│    wide interface        │  ← callers learn a lot
├──────────────────────────┤
│  thin implementation     │  ← but get little in return
└──────────────────────────┘
```

### Classitis

Ousterhout's term for the over-proliferation of tiny classes, each doing very little. Common in Java codebases where "small classes" is treated as a goal rather than a tool. Many shallow wrappers add interface surface without absorbing complexity.

## Practical test

When designing a class or module, ask: does this interface **hide** more than it **exposes**? If a caller needs to understand most of the internals to use the interface correctly, the module is too shallow.

## References

- John Ousterhout, *A Philosophy of Software Design* (2018)
- [Talks at Google — A Philosophy of Software Design](https://www.youtube.com/watch?v=bmSAYlu0NcY)
