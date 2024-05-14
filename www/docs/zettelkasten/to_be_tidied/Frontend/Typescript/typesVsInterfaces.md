# Types vs Interfaces

## Types (Type Aliases)

- Definition: Declared using type keyword.
- Union Types: Can define union types. For example, type StringOrNumber = string | number;.
- Computed Properties: Can use computed properties (mapped types).
- Extending Types: Can extend other types using intersections.

```typescript
type ExtendedType = BaseType & { newProp: string };.
```

- Immutability: Can define immutable properties using readonly.
- Tuples and Arrays: More flexible in defining tuple and array types.

## Interfaces

- Definition: Declared using interface keyword.
- Extensibility: Can be extended using extends keyword. For example,

```typescript
interface ExtendedInterface extends BaseInterface { newProp: string; }.
```

- Implementation: Classes can implement interfaces.
- Merging: Supports declaration merging (two declarations with the same name are merged into one).
- Methods: Can declare methods and also mark them as optional.
- Index Signatures: Supports index signatures for dynamic properties.

## Key Differences

- Extensibility: Interfaces are often preferred for public API's definition due to their extendibility. While types can be extended using intersections, interfaces can be more intuitively extended with the extends keyword.
- Declaration Merging: Interfaces can have multiple merged declarations, but types cannot.
- Union Types: Types can express union types, whereas interfaces cannot.
- Computed Properties: Types can use computed properties, which interfaces cannot.
- Flexibility in Tuples/Arrays: Types offer more options in defining tuples and arrays.

## Usage Recommendations

- Interfaces for API's and Libraries: For defining shapes of objects and classes, especially in libraries and public API's, interfaces are recommended due to their extendibility and declaration merging features.
- Types for Complex Type Expressions: When you need to define unions, intersections, or tuples, or when you work with complex type transformations, type aliases are more suitable.
- In practice, the choice between type and interface can sometimes come down to personal or team preference, especially in cases where their functionality overlaps. However, understanding their differences is crucial for leveraging TypeScript's capabilities effectively.
