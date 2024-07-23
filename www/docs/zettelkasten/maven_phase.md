🗓️ 23072024 1113
📎 #maven #wip

# maven_phase
In Maven, you control which phase a plugin runs in using the `<phase>` configuration element within the `<execution>` section of your plugin configuration. Here's how it works:

**Maven Phases:**

Maven's build lifecycle is divided into several distinct phases, each representing a stage in the build process. Common phases include:

- `validate`: Validates the project structure and configuration.
- `compile`: Compiles the source code.
- `test`: Runs unit tests.
- `package`: Packages the compiled code into a distributable format (JAR, WAR, etc.).
- `install`: Installs the package into your local Maven repository.
- `deploy`: Copies the package to a remote repository for sharing with others.

You can find a complete list of phases in the Maven documentation: [https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

**Plugin Execution and Phases:**

When you configure a plugin in your `pom.xml`, you can specify the phase(s) during which you want its goals to execute. Here's the basic structure:

XML

```
<plugin>
  <groupId>...</groupId>
  <artifactId>...</artifactId>
  <executions>
    <execution>
      <id>...</id>  
      <phase>your-desired-phase</phase>  
      <goals>
        <goal>...</goal> 
      </goals>
    </execution>
  </executions>
</plugin>
```

Use code [with caution.](/faq#coding)

- **`id`:** (Optional) A unique identifier for this execution configuration.
- **`phase`:** The Maven lifecycle phase during which you want the plugin to run.
- **`goals`:** The specific plugin goals you want to execute.

**Example:**

XML

```
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-antrun-plugin</artifactId>
  <executions>
    <execution>
      <phase>compile</phase>
      <goals>
        <goal>run</goal> 
      </goals>
      <configuration>
        </configuration>
    </execution>
  </executions>
</plugin>
```

Use code [with caution.](/faq#coding)

In this example, the `maven-antrun-plugin` is configured to run its `run` goal during the `compile` phase of the build.

**Important Considerations:**

- **Phase Order:** Maven phases execute in a specific order. If you want a plugin to run before another, make sure it's bound to an earlier phase.
- **Default Bindings:** Some plugins have default phase bindings (e.g., the `maven-compiler-plugin`'s `compile` goal runs in the `compile` phase by default). You can override these defaults with your own configuration.
- **Multiple Executions:** You can configure a plugin to execute in multiple phases with different goals or configurations by defining multiple `<execution>` blocks.

Let me know if you have any specific scenarios you'd like help with or want me to elaborate on any aspect of this!

What happens if `<phase>` is not specified?

If the `<phase>` element is not specified within an `<execution>` block of a Maven plugin, the behavior depends on whether the plugin has a _default phase binding_:

**1. Plugin with Default Phase Binding:**

- The plugin's goal will be executed during its **default phase**.
- For example, the `maven-compiler-plugin`'s `compile` goal has a default binding to the `compile` phase. If you don't specify a phase, it will still run during the `compile` phase.

**2. Plugin without Default Phase Binding:**

- The plugin's goal will **not be automatically executed** during any phase of the standard build lifecycle.
- You can still manually trigger the goal using the command line:
    
    Bash
    
    ```
    mvn <plugin-prefix>:<goal>
    ```
    
    Use code [with caution.](/faq#coding)
    
    (Where `<plugin-prefix>` is usually derived from the plugin's `artifactId`.)
- This is often used for utility goals that don't fit neatly into a specific build phase (e.g., code generation, reporting, etc.).

```zsh
mvn exec:java
```

Use code [with caution.](/faq#coding)

**Best Practices:**

- **Clarity:** It's generally considered good practice to explicitly specify the phase for each plugin execution. This makes your build configuration more transparent and easier to understand.
- **Flexibility:** If you need the flexibility to run a goal outside the standard lifecycle or potentially in multiple phases, you can intentionally omit the `<phase>` configuration.

Let me know if you have any more questions!

---
# References
- Gemini
