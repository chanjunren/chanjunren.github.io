🗓️ 06042026 1200

# jar_classifier

**What it is:**
- A **classifier** is a suffix appended to a Maven/Gradle artifact name to distinguish variants of the same artifact
- Format: `artifact-1.0.0-lib.jar` — the `lib` part is the classifier
- Commonly seen in Spring Boot projects where two JARs exist: the executable fat JAR and the plain library JAR

**Why it matters:**
- Spring Boot repackages your JAR into an executable fat JAR (contains all dependencies)
- The original thin JAR (just your compiled classes) is either replaced or preserved with a classifier
- If another module depends on your Spring Boot module, it needs the plain JAR — not the fat one

## Fat JAR vs Plain JAR

### Fat JAR (executable, repackaged by Spring Boot)
- Contains your classes + all dependencies bundled under `BOOT-INF/lib/`
- Has Spring Boot's custom classloader and `Main-Class` manifest entry
- Runnable with `java -jar`
- NOT usable as a library dependency — its class structure is non-standard

### Plain JAR (library, original compilation output)
- Standard JAR with just your compiled `.class` files
- Usable as a dependency by other projects
- Cannot run standalone — no embedded dependencies

## How the Classifier Comes In

### Maven (spring-boot-maven-plugin)
- By default, the plugin **replaces** the original JAR with the fat JAR
- To keep the original, set a classifier on the repackaged JAR:
  - `<classifier>exec</classifier>` → produces `app-1.0.0-exec.jar` (fat) alongside `app-1.0.0.jar` (plain)
- Or the reverse: the fat JAR is the main artifact, plain JAR gets the `lib` classifier

### Gradle (Spring Boot plugin)
- `bootJar` task produces the fat JAR
- `jar` task produces the plain JAR (disabled by default since Spring Boot 2.5+)
- To get both: re-enable `jar` task and configure a classifier on one of them

## When You Need Both JARs

- **Multi-module project**: Module A is a Spring Boot app but Module B depends on A's classes — B needs the plain JAR
- **Shared library that's also runnable**: You want `java -jar` for deployment but also want other services to import it
- **CI publishing**: Publish the plain JAR to a registry for downstream consumers, deploy the fat JAR to servers

## When You Don't

- Standalone application with no downstream consumers — just use the fat JAR
- Microservice that nobody imports — the plain JAR serves no purpose

## Common Confusion

- Trying to use a fat JAR as a dependency → classes are nested under `BOOT-INF/classes/`, so the compiler can't find them
- The error looks like "class not found" even though the JAR clearly contains the class — it's a classloader/path issue, not a missing class issue

```ad-warning
**Fat JARs cannot be used as dependencies**: Spring Boot's repackaged JAR nests classes under `BOOT-INF/classes/`. Other projects importing it will get "class not found" errors. If another module needs your classes, publish or preserve the plain JAR with a classifier.
```

---

## References

- https://docs.spring.io/spring-boot/docs/current/maven-plugin/reference/htmlsingle/#repackage
- https://docs.spring.io/spring-boot/docs/current/gradle-plugin/reference/htmlsingle/#packaging-executable.and-plain-archives
- https://maven.apache.org/pom.html#Dependencies (classifier section)
