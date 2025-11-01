🗓️ 09092025 1158

# adaptive_streaming_architecture
```ad-tldr
Let video players automatically adjust quality based on network conditions
```
## How It Works
- Segmentation: Break video into small chunks (2-10 seconds each)
- Quality Variants: Create same content at different bitrates
- Manifest File: Describe available qualities and segment locations
- Player Logic: Switch between qualities based on bandwidth

## Protocols
- HLS (HTTP Live Streaming): Apple standard, .m3u8 manifests
- DASH: Industry standard, .mpd manifests
- Both use HTTP: Leverage existing web infrastructure

## Segment Strategy
```
video.mp4 → 
- 480p/segment_001.ts (10 seconds)
- 480p/segment_002.ts (10 seconds)
- 720p/segment_001.ts (10 seconds)
- 720p/segment_002.ts (10 seconds)
- manifest.m3u8 (describes all variants)
```
## Benefits
- No buffering: Player switches quality instead of waiting
- Optimal bandwidth usage: Higher quality when possible
- Works across devices: Standard HTTP, no special protocols
- CDN friendly: Segments cache well

---
## References
