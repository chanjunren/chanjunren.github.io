🗓️ 23072024 0956

# maven_scope
In Maven (which seems to be the build tool you're using based on the dependency structure), the `<scope>` tag controls how a dependency is included in your project and its lifecycle phases. It determines:

1. **Classpath Availability:** When the dependency's classes are available to your code.
2. **Transitivity:** Whether the dependency's own dependencies (its dependencies' dependencies) are also included in your project.

Here's a breakdown of common Maven scopes and their effects:

|Scope|Compile Time|Test Time|Runtime|Transitive|Description|
|---|---|---|---|---|---|
|`compile`|Yes|Yes|Yes|Yes|**Default scope:** Dependency is available in all classpaths and propagated to dependent projects.|
|`provided`|Yes|Yes|No|No|Dependency is expected to be provided by the runtime environment (e.g., a web server or container).|
|`runtime`|No|Yes|Yes|Yes|Dependency is needed for execution but not for compilation (e.g., JDBC drivers).|
|`test`|Yes|Yes|No|No|Dependency is needed only for testing (e.g., JUnit).|
|`system`|Yes|Yes|Yes|No|Similar to `provided`, but you manually specify the dependency's location (not recommended for most cases).|
|(None)|Same as `compile`||||If no scope is specified, Maven treats it as `compile`.|

Export to Sheets

**In your specific case:**

- You have a dependency on `okcoin-c2c-model` with version `0.0.7-SNAPSHOT`.
- The commented-out `<scope>compile</scope>` means that, by default, this dependency is available in all stages (compiling your code, running tests, and running your application).
- It also means that if `okcoin-c2c-model` itself has dependencies, those will be included in your project as well.

**Why you might change the scope:**

- **`provided`:** If `okcoin-c2c-model` is provided by your runtime environment (e.g., a container like Tomcat or Jetty), you could set the scope to `provided` to avoid including it in your packaged application (WAR or JAR).
- **`test`:** If `okcoin-c2c-model` is only needed for testing purposes (e.g., it contains test utilities), you could set the scope to `test` to exclude it from your final application artifact.

**Important Note:**

Since your dependency is on a `-SNAPSHOT` version, it's likely still under development. In that case, keeping the default `compile` scope is probably the safest choice, as it ensures you're always using the latest version of the code during development and testing.

Let me know if you'd like a more tailored recommendation based on the specific role of `okcoin-c2c-model` in your project!

---

## References
