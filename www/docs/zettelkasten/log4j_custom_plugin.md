🗓️ 28062024 1001
📎 #log4j2

# log4j_custom_plugin
```ad-info
How to configure a custom plugin

This example is an attempt at a plugin that sanitizes sensitive fields from POJOs, but unfortunately doesn't work because the objects are transformed into Strings at this point
```

1. Implement a plugin with the `@Plugin` annotation
```java
@Plugin(name = "RuleBasedFilter", category = Node.CATEGORY, elementType = Filter.ELEMENT_TYPE)
@Slf4j
public class LogFilter extends AbstractFilter {
  private static final String NULL = "null";

  @Resource
  @PluginFactory
  public static LogFilter createFilter(Configuration config, Node node, String id, Filter filter) {
    return new LogFilter(); // Pass the loaded rules to the constructor
  }

  @Override
  public Filter.Result filter(LogEvent event) {
    Object[] logParameters = event.getMessage().getParameters();

    if (logParameters == null) {
      return Result.NEUTRAL;
    }
    for (int i = 0; i < logParameters.length; i++) {
      Object logParamObj = logParameters[i];
      if (logParamObj == null) {
        continue;
      }

      String className = logParamObj.getClass().getName();
      Optional<LogFilterRule> optionalRule = LogFilterRuleCache.getRule(className);
      if (optionalRule.isPresent()) {
        String transformedInput =
            transformInput(logParamObj, logParamObj.getClass().getSimpleName(), optionalRule.get());
        logParameters[i] = transformedInput;
      }
    }

    return Result.NEUTRAL;
  }

  private String transformInput(Object obj, String simpleClassName, LogFilterRule rule) {
    String objFieldsString =
        rule.getFields().stream()
            .map(
                field -> {
                  try {
                    Object fieldValue = field.get(obj);
                    if (fieldValue == null) {
                      return String.format("%s=%s", field.getName(), NULL);
                    }
                    String valueClassName = fieldValue.getClass().getName();
                    Optional<LogFilterRule> optionalRule =
                        LogFilterRuleCache.getRule(valueClassName);
                    return optionalRule
                        .map(
                            logFilterRule ->
                                transformInput(fieldValue, simpleClassName, logFilterRule))
                        .orElseGet(() -> String.format("%s=%s", field.getName(), fieldValue));

                  } catch (IllegalAccessException e) {
                    return obj.toString(); // Should never happen, accessible set to true in cache
                  }
                })
            .collect(Collectors.joining(","));

    return String.format("%s=(%s)", simpleClassName, objFieldsString);
  }
}

```
2. Update `log4j2.xml` 
```xml
...
<Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <ThresholdFilter level="INFO" onMatch="ACCEPT" onMismatch="DENY"/>
            <PatternLayout>
                <pattern>${CONSOLE_LOG_PATTERN}</pattern>
            </PatternLayout>
            <Filters>
                <RegexFilter regex="${LOGGING_EXCLUDE_REGEX}" useRawMsg ="false" onMatch="DENY" onMismatch="NEUTRAL"/>
                <RuleBasedFilter />
            </Filters>
        </Console>
...
```

---

# References
- https://logging.apache.org/log4j/2.x/manual/plugins.html
- https://www.kdgregory.com/index.php?page=logging.log4j2Plugins