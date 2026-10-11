🗓️ 23072024 1113
📎 #maven #wip

# maven_phase

## Build lifecycle
| Phase      | Description                                               |
| ---------- | --------------------------------------------------------- |
| `validate` | validates project structure / configuration               |
| `compile`  | compile source code                                       |
| `test`     | run unit tests                                            |
| `package`  | packages compiled code into distributed format (e.g. JAR) |
| `install`  | install package into local maven repository               |
| `deploy`   | cpoies package into remote repository                     |
> [https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html](https://maven.apache.org/guides/introduction/introduction-to-the-lifecycle.html)

## Plugin Structure
- **`id`:** (Optional) A unique identifier for this execution configuration.
- **`phase`:** The Maven lifecycle phase during which you want the plugin to run.
- **`goals`:** The specific plugin goals you want to execute.


```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-antrun-plugin</artifactId>
  <executions>
    <execution>
      <id>...</id>
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
> Example

## Important Considerations

- **Phase Order** 
	- Maven phases execute in a specific order
	- (Consider the order if you want a plugin to run before another)
- **Default Bindings**
	- Some plugins have default phase bindings
	- Can override these defaults with your own configuration
- **Multiple Executions** 
	- You can configure a plugin to execute in multiple phases with different goals or configurations by defining multiple `<execution>` blocks.


---

## References

- Gemini
