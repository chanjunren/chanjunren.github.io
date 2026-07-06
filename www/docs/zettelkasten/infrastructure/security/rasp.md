🗓️ 06072026 1100
📎 #security #jvm #appsec

# rasp

> Runtime Application Self-Protection — security controls embedded inside the running application (not at the network edge) that detect and block attacks using the app's own execution context: what code path is running, what data is tainted, what the query actually looks like after all string-building is done.

## What Problem It Solves

- A WAF inspects HTTP request/response bytes at the perimeter. It pattern-matches `' OR 1=1`-style payloads without knowing whether that string ever reaches a SQL execution point, or whether the app already sanitized it.
- RASP sits inside the process (JVM agent, runtime hook) and watches control flow. It knows: this string originated from an HTTP parameter, flowed unsanitized into `Statement.executeQuery`, therefore block/alert. That's taint tracking, not pattern matching.
- Fewer false positives than a WAF at the same detection rate, because it has ground truth about what the app actually did with the input — but it's blind to network-layer attacks (DDoS, protocol abuse) since it only sees requests that already reached application code.

## How It's Usually Built (JVM)

- Java agent (`-javaagent:rasp.jar`) attached at JVM startup, sometimes attached dynamically via the Attach API.
- Bytecode instrumentation (ASM / ByteBuddy) rewrites security-sensitive methods on class load: `Runtime.exec`, JDBC `Statement.execute*`, deserialization entry points, `Class.forName`, XXE-prone XML parsers.
- The instrumented method now calls into the RASP runtime before/after execution — inspects arguments, checks taint metadata, decides allow / block / log.
- Taint propagation: HTTP request params, headers, cookies get tagged "tainted" at ingress (e.g. `HttpServletRequest.getParameter`); the tag rides along through `String` concatenation via instrumented `StringBuilder.append`; sink methods (SQL exec, command exec) check whether tainted input reached them un-sanitized.

## Detection vs Prevention Mode

| Mode | Behavior |
|---|---|
| Monitor | Log the detected attack, let the request proceed — used to tune rules before enforcing |
| Block | Short-circuit before the sink executes, return a generic error |
| Virtual patch | Block a specific CVE'd code path without waiting for a code fix — buys time to patch properly |

## RASP vs WAF vs IAST

| | Vantage point | Sees | When it runs |
|---|---|---|---|
| WAF | Network edge / reverse proxy | Raw HTTP bytes | Every request, in production |
| RASP | Inside the running app | The app's own execution + data flow | Every request, in production |
| IAST | Inside the app, instrumented | Same as RASP | Only during QA/test traffic, not prod |

RASP and IAST often share the same instrumentation layer — RASP is IAST's detection turned on in production and wired to block instead of just report.

## Trade-offs

- **Pros**: context a WAF can't get (post-sanitization state, the actual call the app makes), catches app-logic bugs a signature can't (business-logic abuse, not just injection strings).
- **Cons**: adds latency per instrumented call site; false positives can break legitimate app behavior if taint tracking is too aggressive; an agent bug is now inside your app's fault domain, unlike an external WAF; needs re-verification on every JVM/framework upgrade since instrumentation targets specific method signatures.

## Related

- [[log4j_custom_plugin]] — same bytecode/agent-adjacent territory (custom Log4j plugin vs runtime instrumentation)
- [[circuit_breaker_pattern]] — different failure domain, same "guard the call site" instinct

---

## References

- [OWASP — Runtime Application Self-Protection](https://owasp.org/www-community/Runtime_Application_Self_Protection)
- [Wikipedia — Runtime application self-protection](https://en.wikipedia.org/wiki/Runtime_application_self-protection)
