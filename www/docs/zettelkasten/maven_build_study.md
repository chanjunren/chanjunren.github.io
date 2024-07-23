🗓️ 23072024 0958
📎

# maven_build_study

## Maven Compiler Plugin (maven-compiler-plugin)
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-compiler-plugin</artifactId>
  <configuration>
    <encoding>utf-8</encoding>
  </configuration>
</plugin>
```
> **Compiles** `java` source code
- Sets character encoding for source files to `utf-8`

## GMavenPlus Plugin (gmavenplus-plugin)
```xml
<plugin>
  <groupId>org.codehaus.gmavenplus</groupId>
  <artifactId>gmavenplus-plugin</artifactId>
  <version>1.13.0</version>
  <executions>
    <execution>
      <goals>
        <goal>addSources</goal>
        <goal>compile</goal>
        <goal>addTestSources</goal>
        <goal>compileTests</goal>
      </goals>
    </execution>
  </executions>
</plugin>

```
> Integrates `Groovy` language with Maven
> Allows **compiling and running** of `Groovy` 
### Executions
| Action           | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `addSources`     | add `groovy` source files to project source directories    |
| `compile`        | compiles groovy source code                                |
| `addTestSources` | add test source files to project's test source directories |
| `compileTests`   | compiles groovy test code                                  |

## Maven Surefire Plugin (maven-surefire-plugin)
```xml
<plugin>
  <groupId>org.apache.maven.plugins</groupId>
  <artifactId>maven-surefire-plugin</artifactId>
  <version>2.21.0</version>

  <configuration>
    <includes>
      <include>**/*Spec.groovy</include>
      <include>**/*Test.groovy</include>
    </includes>
    <systemProperties>
      <property>
        <name>allure.results.directory</name>
        <value>./allure-results</value>
      </property>
    </systemProperties>
    <argLine> -Dcustom=${oktest.env} -Doktest.env=${oktest.env} </argLine>
  </configuration>
</plugin>

```
> Executes unit tests

### Configuration
| Configuration      | Description                               |
| ------------------ | ----------------------------------------- |
| `includes`         | What to include in test                   |
| `systemProperties` | Sets system properties for test execution |
| `argLine`          | Additional arguments to`JVM               |

## Resources
```xml
<resources>
  <resource>
    <directory>src/main/java</directory>
    <includes>
      <include>**/*.xml</include>
    </includes>
  </resource>
  <resource>
    <directory>src/main/resources</directory>
    <includes>
      <include>*.xml</include>
      <include>*.properties</include>
      <include>**/*.properties</include>
      <include>**/*.xml</include>
      <include>globalframework/commons/**/*.properties</include>
      <include>projects/images/*.*</include>
    </includes>
  </resource>
</resources>

```
> Tells Maven which files should be included in the **final build artifacts** 
	- e.g., JAR or WAR



## Case study
```xml
<build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <configuration>
                    <encoding>utf-8</encoding>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.codehaus.gmavenplus</groupId>
                <artifactId>gmavenplus-plugin</artifactId>
                <version>1.13.0</version>
                <executions>
                    <execution>
                        <goals>
                            <goal>addSources</goal>
                            <goal>compile</goal>
                            <goal>addTestSources</goal>
                            <goal>compileTests</goal>
                        </goals>
                    </execution>
                </executions>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>2.21.0</version>

                <configuration>
                    <includes>
                        <include>**/*Spec.groovy</include>
                        <include>**/*Test.groovy</include>
                    </includes>
                    <systemProperties>
                        <property>
                            <name>allure.results.directory</name>
                            <value>./allure-results</value>
                        </property>
                    </systemProperties>
                    <argLine>
                        -Dcustom=${oktest.env} -Doktest.env=${oktest.env}
                    </argLine>
                </configuration>
            </plugin>
        </plugins>
        <resources>
            <resource>
                <directory>src/main/java</directory>
                <includes>
                    <include>**/*.xml</include>
                </includes>
            </resource>

            <resource>
                <directory>src/main/resources</directory>
                <includes>
                    <include>*.xml</include>
                    <include>*.properties</include>
                    <include>**/*.properties</include>
                    <include>**/*.xml</include>
                    <include>globalframework/commons/**/*.properties</include>
                    <include>projects/images/*.*</include>
                </includes>
            </resource>
        </resources>
    </build>
    <profiles>
        <profile>
            <id>swimlane</id>
            <activation>
                <activeByDefault>true</activeByDefault>
            </activation>
            <build>
                <plugins>
                    <plugin>
                        <artifactId>maven-antrun-plugin</artifactId>
                        <version>1.8</version>
                        <executions>
                            <execution>
                                <phase>compile</phase>
                                <goals>
                                    <goal>run</goal>
                                </goals>
                                <configuration>
                                    <tasks>
                                        <echo>Using test-SwimlaneEnvs.properties</echo>
                                        <delete dir="src/main/resources/projects/config/currentconfig"/>
                                        <delete dir="${project.build.outputDirectory}/projects/config/currentconfig" />
                                        <copy todir="src/main/resources/projects/config/currentconfig">
                                            <fileset dir="src/main/resources/projects/config/test-SwimlaneEnvs"/>
                                        </copy>
                                        <copy todir="${project.build.outputDirectory}/projects/config/currentconfig">
                                            <fileset dir="src/main/resources/projects/config/test-SwimlaneEnvs"/>
                                        </copy>
                                    </tasks>
                                </configuration>
                            </execution>
                        </executions>
                    </plugin>
                </plugins>
            </build>
        </profile>
    </profiles>
```

```ad-question
How a specific profile's `<build>` interacts with the main `<build>`
```
**Interaction**

1. **Default Activation:** Because the `swimlane` profile is active by default, its build actions will execute whenever you run a Maven build (`mvn clean install`, `mvn package`, etc.).
    
2. **Early Execution:** The `maven-antrun-plugin` is configured to run in the `compile` phase. This means its actions will be executed _before_ the main `<build>` section's actions, which typically occur later in the lifecycle (like `test`, `package`, etc.).
    
3. **Configuration Replacement:** The `maven-antrun-plugin` effectively overrides the configuration files used during compilation and testing. The properties and XML files originally in `src/main/resources/projects/config/currentconfig` will be replaced with those from `src/main/resources/projects/config/test-SwimlaneEnvs`.
    

**Key Points**

- **Purpose:** The `swimlane` profile seems to be designed to streamline the use of a specific test configuration. By activating it by default and executing early in the build, it ensures that the test configuration is in place before your code is compiled or tested.
- **Customization:** If you want to use a different configuration (e.g., for production), you'd either deactivate this profile or create a new profile with a different `maven-antrun-plugin` configuration to copy in the appropriate files.

Let me know if you have any further questions or would like a deeper dive into specific aspects of this setup!

---

# References
- Gemini
