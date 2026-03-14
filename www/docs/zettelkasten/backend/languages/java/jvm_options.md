🗓️ 31082025 1203

# jvm_options

# 🧠 JVM Options Cheatsheet (with Explanations)

## **A. Heap Memory Management**

| **Parameter** | **Purpose**                        | **Recommended Rule**           | **Risk if Misconfigured**                                          | **Severity** |
|---------------|------------------------------------|--------------------------------|--------------------------------------------------------------------|--------------|
| `-Xmx<size>`  | Sets **maximum heap size**         | If RAM < = 16G -> `50%` of RAM | Too small -> frequent GCs; too large -> OOM                        | Low          |
| `-Xmx<size>`  | Same as above                      | If RAM >16G -> `65%` of RAM    | Same as above                                                      | Low          |
| `-Xmx<size>`  | Ensures minimum allocation         | Always > = **40% of RAM**      | Heap too small -> OOM under load                                   | Medium       |
| `-Xmx<size>`  | Prevents starving OS/direct memory | Always < = **75% of RAM**      | Too large -> OS and NIO buffers starved                            | Medium       |
| `-Xms<size>`  | Sets **initial heap size**         | Set `-Xms = -Xmx`              | Without this, JVM resizes heap dynamically -> pauses & instability | **High**     |


## **B. Direct Memory & Buffer Control**

| **Parameter**                                         | **Purpose**                                                     | **Recommended Rule**                            | **Risk if Misconfigured**                          | **Severity** |
|-------------------------------------------------------|-----------------------------------------------------------------|-------------------------------------------------|----------------------------------------------------|--------------|
| `-XX:MaxDirectMemorySize`                             | Allocates **off-heap direct memory** (e.g., NIO buffers, Netty) | Set = `15% * -Xmx`                              | Too high ->  heap starved; too low -> frequent GCs | Low          |
| `-XX:MaxDirectMemorySize`                             | Minimum recommended size                                        | erm > = **256M**                                | Too small -> NIO buffers fail                      | Medium       |
| `-XX:MaxDirectMemorySize`                             | Upper safety cap                                                | erm < = `25% * -Xmx`                            | Too large -> less space for heap                   | Medium       |
| `--add-opens=java.base/jdk.internal.misc=ALL-UNNAMED` | Opens restricted APIs for monitoring                            | Required for accurate **direct memory metrics** | Missing this -> some monitoring tools break        | Medium       |

## **C. OutOfMemory (OOM) Troubleshooting**

| **Parameter**                     | **Purpose**                | **Recommended Rule**                                                                                                 | **Risk if Misconfigured**                     | **Severity** |
|-----------------------------------|----------------------------|----------------------------------------------------------------------------------------------------------------------|-----------------------------------------------|--------------|
| `-XX:+HeapDumpOnOutOfMemoryError` | Dumps heap when OOM occurs | Always enable                                                                                                        | No heap dump -> hard to troubleshoot          | **High**     |
| `-XX:HeapDumpPath=`               | Path to store heap dumps   | Use persistent storage:  Container `/hostdata/crash/{svc}.oom.hprof`  Host `/data/crash/{svc}.oom.hprof`             | Wrong path -> dump lost after container crash | **High**     |
| `-XX:ErrorFile=`                  | JVM fatal error logs       | Set persistent paths:  Container `/hostdata/crash/{svc}.hs_err_pid%p.log`  Host `/data/crash/{svc}.hs_err_pid%p.log` | Wrong path -> JVM crash logs lost             | **High**     |


## **D. Garbage Collection (GC) & Logging**

| **Parameter** | **Purpose**        | **Recommended Rule**                                    | **Risk if Misconfigured**                                    | **Severity** |
|---------------|--------------------|---------------------------------------------------------|--------------------------------------------------------------|--------------|
| `-Xlog:gc*`   | Enables GC logging | If logs **synced**:  `filecount=1`, `filesize=200m`     | Oversized GC logs -> disk bloat; wrong level -> missing info | **High**     |
| `-Xlog:gc*`   | Same as above      | If logs **not synced**:  `filecount=5`, `filesize=200m` | Needed for historical troubleshooting                        | **High**     |


## **E. Logging & Encoding**

| **Parameter**              | **Purpose**               | **Recommended Rule**                                                   | **Risk if Misconfigured**                            | **Severity** |
|----------------------------|---------------------------|------------------------------------------------------------------------|------------------------------------------------------|--------------|
| `-Dlog4j2.contextSelector` | Enables **async logging** | Set = `org.apache.logging.log4j.core.async.AsyncLoggerContextSelector` | Without it -> sync logging blocks threads under load | **High**     |
| `-Dfile.encoding`          | Default JVM encoding      | Set = `UTF-8`                                                          | Using non-UTF8 -> encoding issues, broken transfers  | **High**     |

## **F. Security & Stability**

| **Parameter**                       | **Purpose**                   | **Recommended Rule**         | **Risk if Misconfigured**                                                                                  | **Severity** |
|-------------------------------------|-------------------------------|------------------------------|------------------------------------------------------------------------------------------------------------|--------------|
| `-Dfastjson.parser.safeMode`        | Secures **Fastjson parser**   | Set = `true`                 | Vulnerable to **remote code execution** ([Ref](https://kb.transwarp.cn/posts/8267?utm_source=chatgpt.com)) | **High**     |
| `-Djava.awt.headless`               | Disables GUI rendering        | Set = `true`                 | Without it -> CPU wasted on GUI init                                                                       | **High**     |
| `-Dspring.devtools.restart.enabled` | Hot reload toggle             | Set = `false` in prod        | Hot reload restarts prod services unexpectedly                                                             | **High**     |
| _(General)_                         | Don’t put secrets in JVM args | Use KMS instead              | Secrets exposed in logs / process lists                                                                    | **High**     |
| _(General)_                         | Uniform JVM configs           | All instances **must match** | Inconsistent configs -> stability risks                                                                    | **High**     |

---

## **G. Performance & Profiling**

| **Parameter**             | **Purpose**                                 | **Recommended Rule**                                                             | **Risk if Misconfigured**                               | **Severity** |
|---------------------------|---------------------------------------------|----------------------------------------------------------------------------------|---------------------------------------------------------|--------------|
| `-XX:+UseZingMXBeans`     | Exposes JVM metrics                         | Always enable                                                                    | Without it -> harder debugging                          | **High**     |
| `-XX:+ProfileLiveObjects` | Enables object histograms via `jmap -histo` | Always enable                                                                    | Without it -> less visibility into leaks                | **High**     |
| `-XX:ProfileLogIn`        | Path for JIT profile logs                   | Container: `/app/logs/profile_jit.log`  Host: `/data/logs/{svc}/profile_jit.log` | Without it -> ReadyNow JIT warmup optimization disabled | Medium       |
| `-XX:ProfileLogOut`       | Same as above                               | Same path as `ProfileLogIn`                                                      | Same impact as above                                    | Medium       |

## ✅ Quick Recommendations
### **1. Heap Settings**
- Start: `-Xms = -Xmx`
- Size:
    - < = 16G -> `-Xmx = 50%` of RAM
    - > 16G -> `-Xmx = 65%` of RAM
### **2. Direct Memory**
- Default ~ `15% * -Xmx`
- Keep < = `25% * -Xmx`
- Always >= 256M
### **3. Logging**
- Use **async logging**.
- Keep GC logs rotated (`filesize=200m`, `filecount=5` if not synced).
### **4. Security**
- Always enable `-Dfastjson.parser.safeMode=true`
- Avoid secrets in JVM args.
### **5. Troubleshooting**
- Enable heap dumps, error logs, and profile logs.
- Always keep paths in persistent volumes for containers.

---
## References

