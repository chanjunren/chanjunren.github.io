🗓️ 09042024 0956
📎 #maven

# bill_of_materials

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.apache.camel.springboot</groupId>
            <artifactId>camel-spring-boot-bom</artifactId>
            <version>3.14.4</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
        <!-- Other managed dependencies -->
    </dependencies>
</dependencyManagement>

```

- Control versions of project's dependencies
- Reduces needs to specify versions of individual dependencies

---

# References
