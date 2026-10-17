🗓️ 17102026 2135

# service_provider_interface

Java's service-provider pattern lets a library define an interface and discover implementations supplied separately.

The service is the API consumers depend on. A provider implements that service. `ServiceLoader` discovers providers at runtime, so the application can use an implementation without hard-coding its concrete class. On the class path, providers are listed in `META-INF/services/<service-binary-name>`; named modules declare them with `provides ... with ...` and consumers declare `uses`.

```java
ServiceLoader<Codec> codecs = ServiceLoader.load(Codec.class);
for (Codec codec : codecs) {
    // choose or use a discovered implementation
}
```

Discovery is not selection policy: if several providers exist, the application still needs a rule for choosing one. Provider construction can also fail, so handle configuration and loading errors at the boundary.

For loading classes at runtime, see [[class_loading]]. For packaging Java libraries, see [[jar_types]].

```mermaid
flowchart LR
    A[API defines service interface] --> P[Provider implements interface]
    P --> J[Provider JAR registration]
    C[Consumer calls ServiceLoader] --> D[Discover providers on classpath]
    J --> D
    D --> I[Instantiate provider]
    I --> C
```

## References

- [Java 17 API: ServiceLoader](https://docs.oracle.com/en/java/javase/17/docs/api/java.base/java/util/ServiceLoader.html)
