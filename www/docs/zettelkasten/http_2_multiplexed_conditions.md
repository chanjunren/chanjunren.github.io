🗓️ 09092025 1449

# http_2_multiplexed_conditions

### **The Concept**
```
HTTP/1.1: Single lane highway (requests wait in line)
Request 1: ████████████ (blocks everything)
Request 2:              ████████ (waits)
Request 3:                      ████ (waits)

HTTP/2: Multi-lane highway (parallel requests)
Request 1: ████████████
Request 2: ████████ (simultaneous!)
Request 3: ████ (also simultaneous!)
```

### **Benefits for Video**
- **Single connection**: Reuse same TCP connection
- **No blocking**: Fast requests don't wait for slow ones
- **Lower latency**: No connection setup overhead
- **Video streaming**: Request manifest + segments simultaneously

### **Performance Impact**
- **Connection setup**: 1 connection vs 6+ connections
- **Loading time**: 30-50% faster for multi-file scenarios
- **Mobile benefits**: Especially important on high-latency networks



---
## References
