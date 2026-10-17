🗓️ 04022025 0952

# class_loading

- In Java, a **class loader** is responsible for loading classes into the JVM
- When you run a Java program, the JVM doesn't load all classes at once
- Instead, classes are loaded dynamically as they are needed during runtime
- This process is handled by one or more class loaders.

## Types of Class Loaders

```ad-info
Java uses a **hierarchical class loading mechanism** with the following types of class loaders
```

### Bootstrap Class Loader

- The root class loader.
- Loads core Java classes (e.g., classes in `java.lang`, `java.util`, etc.) from the `rt.jar` file in the JRE.
- Written in native code (not Java).

### Extension Class Loader

- Loads classes from the `lib/ext` directory of the JRE or other specified directories.
- Handles extensions to the standard Java libraries.

### Application Class Loader (System Class Loader)

- Loads classes from the application's classpath (e.g., your JAR files, `-cp` or `-classpath` arguments).
- This is the default class loader for user-defined classes.

### Custom Class Loaders

- Developers can create their own class loaders by extending the `ClassLoader` class.
- Used in frameworks like [[flink]], Tomcat, or OSGi to implement custom class loading strategies (e.g., isolating user code from framework code)

## How Class Loading Works

### Delegation Model

- Class loaders follow a **parent-delegation model**. When a class loader is asked to load a class, it first delegates the request to its parent class loader.
- The parent class loader repeats the process until the request reaches the Bootstrap Class Loader.
- If the parent class loader cannot find the class, the child class loader attempts to load it

### Class Loading Steps

1. **Loading**: The class loader reads the `.class` file (bytecode) from the file system, network, or other sources.
2. **Linking**:
   - **Verification**: Ensures the bytecode is valid and adheres to JVM specifications.
   - **Preparation**: Allocates memory for static fields and initializes them to default values.
   - **Resolution**: Resolves symbolic references to other classes, methods, and fields.

- **Initialization**: Executes static initializers and assigns correct values to static fields.

3. **Class Loader Isolation**:
   - Each class loader has its own namespace. Two classes loaded by different class loaders are considered different, even if they have the same fully qualified name.
   - This can lead to issues like `ClassCastException` or `LinkageError` if the same class is loaded by multiple class loaders.

## **Why Class Loading Matters**

1. **Modularity**:
   - Class loaders allow applications to load classes dynamically, enabling features like plugins, hot deployment, and modular architectures.
2. **Isolation**:
   - Frameworks like Apache Flink use custom class loaders to isolate user code from framework code. This prevents conflicts between user dependencies and framework dependencies.
3. **Security**:
   - Class loaders can enforce security policies by controlling which classes are loaded and from where.

---

## References

- Deepseek
