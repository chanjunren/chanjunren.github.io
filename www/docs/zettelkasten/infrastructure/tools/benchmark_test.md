🗓️ 26052025 1213

# benchmark_test
```java
package com.example.jmh;

import com.github.benmanes.caffeine.cache.Caffeine;
import com.github.benmanes.caffeine.cache.LoadingCache;
import com.google.common.cache.CacheBuilder;
import com.google.common.cache.CacheLoader;
import org.openjdk.jmh.annotations.*;
import org.openjdk.jmh.runner.Runner;
import org.openjdk.jmh.runner.options.Options;
import org.openjdk.jmh.runner.options.OptionsBuilder;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeUnit;

/**
 * A benchmark for comparing get/put performance of various in-memory caching strategies.
 */
@State(Scope.Benchmark)
@Fork(1)
@Warmup(iterations = 1, time = 3)
@Measurement(iterations = 3, time = 3)
@OutputTimeUnit(TimeUnit.MILLISECONDS)
@BenchmarkMode({Mode.Throughput, Mode.AverageTime})
public class CacheBenchmark {

    private static final String KEY = "sample-key";
    private static final String VALUE = """
            {
              "symbol": "BTC",
              "price": 68000.00,
              "contracts": [
                {"name": "BTC-Week", "id": "1"},
                {"name": "BTC-NextWeek", "id": "2"}
              ]
            }
            """;

    private static final LoadingCache<String, String> caffeineCache = Caffeine.newBuilder()
            .initialCapacity(1024)
            .maximumSize(1024)
            .refreshAfterWrite(200, TimeUnit.MILLISECONDS)
            .expireAfterWrite(10, TimeUnit.SECONDS)
            .build(k -> VALUE);

    private static final com.google.common.cache.LoadingCache<String, String> guavaCache = CacheBuilder.newBuilder()
            .initialCapacity(1024)
            .maximumSize(1024)
            .concurrencyLevel(8)
            .refreshAfterWrite(200, TimeUnit.MILLISECONDS)
            .expireAfterWrite(10, TimeUnit.SECONDS)
            .build(new CacheLoader<>() {
                @Override
                public String load(String key) {
                    return VALUE;
                }
            });

    private static final Map<String, String> concurrentHashMap = new ConcurrentHashMap<>(1024);
    private static final Map<String, String> hashMap = new HashMap<>(1024);

    @Setup
    public void setup() {
        caffeineCache.put(KEY, VALUE);
        guavaCache.put(KEY, VALUE);
        concurrentHashMap.put(KEY, VALUE);
        hashMap.put(KEY, VALUE);
    }

    // ==== GET BENCHMARKS ====

    @Benchmark
    @Threads(8)
    public String benchmarkGuavaGet() throws ExecutionException {
        return guavaCache.get(KEY);
    }

    @Benchmark
    @Threads(8)
    public String benchmarkCaffeineGet() {
        return caffeineCache.get(KEY);
    }

    @Benchmark
    @Threads(8)
    public String benchmarkConcurrentHashMapGet() {
        return concurrentHashMap.get(KEY);
    }

    @Benchmark
    @Threads(8)
    public String benchmarkHashMapGet() {
        return hashMap.get(KEY);
    }

    // ==== PUT BENCHMARKS ====

    @Benchmark
    @Threads(8)
    public void benchmarkCaffeinePut() {
        caffeineCache.put(UUID.randomUUID().toString(), VALUE);
    }

    @Benchmark
    @Threads(8)
    public void benchmarkGuavaPut() {
        guavaCache.put(UUID.randomUUID().toString(), VALUE);
    }

    @Benchmark
    @Threads(8)
    public void benchmarkConcurrentHashMapPut() {
        concurrentHashMap.put(UUID.randomUUID().toString(), VALUE);
    }

    @Benchmark
    @Threads(8)
    public void benchmarkHashMapPut() {
        hashMap.put(UUID.randomUUID().toString(), VALUE);
    }

    public static void main(String[] args) throws Exception {
        Options options = new OptionsBuilder()
                .include(CacheBenchmark.class.getSimpleName())
                .forks(1)
                .build();

        new Runner(options).run();
    }
}

```

---
## References
