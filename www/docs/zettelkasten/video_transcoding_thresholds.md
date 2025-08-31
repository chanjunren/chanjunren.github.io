🗓️ 09092025 1455
📎

# video_transcoding_thresholds
## 📊 Chunked Upload Thresholds

### **When to Use Chunked Uploads**
| File Size | Strategy          | Reason                                     |
| --------- | ----------------- | ------------------------------------------ |
| < 50MB    | Single upload     | Network can handle reliably                |
| 50-100MB  | Consider chunking | Depends on audience (mobile vs enterprise) |
| > 100MB   | Always chunk      | Failure rate jumps significantly           |

### **Chunking Sweet Spots**
- **Enterprise users**: 500MB threshold (better networks)
- **Mobile-first**: 50MB threshold (data limitations)  
- **Global audience**: 100MB threshold (varied network quality)

### Why 100MB?
- **Upload failure rate**: Jumps from ~1% to ~15% above 100MB
- **Browser timeouts**: Default 30-60 seconds for large requests
- **User experience**: Failed 500MB upload = 20 minutes wasted
- **Resume capability**: Chunks allow partial retry vs full restart


---
# References
