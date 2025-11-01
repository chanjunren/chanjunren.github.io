🗓️ 04102025 0030
📎 [[networking_dns_tools]]

# Connectivity & Network Path Tools

Tools for testing if hosts are reachable and tracing network paths.

---

## `ping` - Test Connectivity

### Commands
```bash
ping example.com              # Basic ping (infinite)
ping -c 4 example.com        # Send 4 packets only
ping -i 2 example.com        # 2 second interval
ping -t 5 example.com        # Set TTL (Time To Live)
ping -s 1000 example.com     # Set packet size (bytes)
```

**Use for**: Testing if host is reachable, measuring latency and packet loss.

**What it does**: Sends ICMP (Internet Control Message Protocol) echo request packets and waits for replies.

### Interpreting Output

```bash
$ ping -c 4 google.com
PING google.com (142.250.185.78): 56 data bytes
64 bytes from 142.250.185.78: icmp_seq=0 ttl=117 time=12.4 ms
64 bytes from 142.250.185.78: icmp_seq=1 ttl=117 time=11.8 ms
64 bytes from 142.250.185.78: icmp_seq=2 ttl=117 time=13.1 ms
64 bytes from 142.250.185.78: icmp_seq=3 ttl=117 time=12.0 ms

--- google.com ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 11.8/12.3/13.1/0.5 ms
```

**Key parts**:
- **`64 bytes from...`**: Successful reply received
- **`icmp_seq`**: Sequence number (should increment 0, 1, 2, 3...)
- **`ttl`**: Time To Live - hops remaining (starts at ~64 or ~128, decrements each hop)
- **`time`**: Round-trip time in milliseconds (latency)
- **Statistics**:
  - `0.0% packet loss` - Perfect (0% = good, >5% = concerning)
  - `min/avg/max` - Latency range
  - `stddev` - Consistency (low = stable, high = jittery)

**Common issues**:
- **Request timeout**: No response (host down, firewall blocking, or network issue)
- **Unknown host**: DNS can't resolve name (use [[networking_dns_tools]] to investigate)
- **High latency** (>100ms): Slow connection
- **Packet loss**: Unstable connection (use [[networking_advanced_debugging]] for deep analysis)
- **Destination Host Unreachable**: Router can't find route to host

**Good latency values**:
- `< 20ms` - Excellent (local network or nearby server)
- `20-50ms` - Good (regional)
- `50-100ms` - Acceptable (international)
- `> 100ms` - Slow (distant server or congestion)

---

## `traceroute` - Trace Network Path

### Commands
```bash
traceroute example.com       # See route to host (Linux/Mac)
tracert example.com          # Windows version
traceroute -n example.com    # Faster (no DNS resolution)
traceroute -m 20 example.com # Max 20 hops (default 30)
traceroute -q 1 example.com  # 1 query per hop (faster)
```

**Use for**: Finding where connection fails, diagnosing slow connections, understanding network topology.

**What it does**: Shows the route packets take to reach a destination by sending packets with increasing TTL values.

### Interpreting Output

```bash
$ traceroute google.com
traceroute to google.com (142.250.185.78), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.234 ms  1.123 ms  1.056 ms
 2  10.0.0.1 (10.0.0.1)  5.678 ms  5.432 ms  5.890 ms
 3  isp-gateway.net (203.0.113.1)  12.456 ms  12.234 ms  12.567 ms
 4  * * *
 5  142.250.185.78 (142.250.185.78)  18.234 ms  17.890 ms  18.456 ms
```

**Key parts**:
- **Hop number** (1, 2, 3...): Each router along the path
- **IP address/hostname**: The router at this hop
- **Three time values**: Round-trip time for 3 probes (shows consistency)
- **`* * *`**: Timeout (router not responding to traceroute, but still forwarding packets)

**Reading the path**:
1. **Hop 1**: Your router/gateway (usually `192.168.x.x` or `10.x.x.x`)
2. **Hop 2-3**: Your ISP's routers
3. **Middle hops**: Internet backbone routers
4. **Last hop**: Destination server

**Troubleshooting with traceroute**:
- **Connection dies at specific hop**: That router is the problem
- **Sudden latency spike**: Congestion or long-distance link starting at that hop
- **`* * *` for all hops after X**: Firewall blocking ICMP after hop X (doesn't mean packets aren't getting through)
- **Asymmetric routing**: Path there ≠ path back (normal, just FYI)

**Example diagnosis**:
```bash
 1  router.local (192.168.1.1)     1 ms   1 ms   1 ms   ✅ Local network fine
 2  isp.gateway (10.0.0.1)         5 ms   5 ms   5 ms   ✅ ISP connection fine  
 3  * * *                                                ⚠️ Router not responding (OK)
 4  remote.net (203.0.113.1)     500 ms 498 ms 502 ms   ❌ High latency! Problem here
```

---

## References

- [[networking_dns_tools]] - Use if ping shows "Unknown host"
- [ping manual](https://linux.die.net/man/8/ping)
- [traceroute manual](https://linux.die.net/man/8/traceroute)

