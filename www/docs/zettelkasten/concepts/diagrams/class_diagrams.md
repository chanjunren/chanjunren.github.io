🗓️ 06042024 1404

# class_diagrams

## Class

![[uml_class_diagram.png]]

### Visibility

- `+` : public
- `-` : private
- `#` : protected
- `~` : package private

## Association

![[class_diagrams_association.png]]

## Inheritance

![[uml_inheritance.png]]

## Dependency

![[class_diagram_dependency.png]]

```ad-quote
In software design, a dependency relationship indicates that one class requires another to function properly, but this doesn't necessarily mean they are directly associated or connected. This concept is often a bit abstract, but it can be broken down as follows:

### Dependency Without Direct Association
A class (Class A) may depend on Class B if it uses Class B as a parameter in a method, or if it creates instances of Class B within its methods

However, Class A doesn't maintain a reference to Class B as part of its state (i.e., as a field or property).

### Use Cases for Dependency
Dependencies can occur in several contexts, such as:
    - **Local Variables**: Class A uses Class B within a method as a local variable.
    - **Method Parameters**: Class A has methods that accept Class B as a parameter.
    - **Return Types**: A method in Class A returns an instance of Class B.
    - **Creation within Methods**: Class A creates instances of Class B within a method but doesn't store them.
####Direction of Dependency###
The direction is from the dependent class to the class it depends on

It's a one-way relationship indicating that if the class being depended on (Class B) changes, the dependent class (Class A) might also need to change

### Design Implications
Dependencies should be managed carefully in design because they can lead to increased coupling between classes. High coupling can make code more difficult to maintain and test

One common approach to managing dependencies and reducing coupling is the use of interfaces or abstract classes, allowing for more flexible and interchangeable components.
```

## Composition

![[uml_composition.png]]

> _Cascading deletion_: `part` is destroyed together with `whole` > `whole` and `part` must also be an integral part of each other

## Aggregation

![[class_diagrams_aggregation.png]]k

> _container-contained relationship_ (weaker than composition)
> `containee` can exist even after `container` is destroyed

## Interface

![[uml_interface.png]]

---

## References

- NUS CS2103T Textbook
