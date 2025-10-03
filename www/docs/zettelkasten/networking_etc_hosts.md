🗓️ 04102025 0030
📎 [[networking_dns_tools]]

# /etc/hosts File

Local DNS override file that is checked before DNS servers.

---

## What is it?

The `/etc/hosts` file is a **local DNS override file** that maps hostnames to IP addresses. 

**Key point**: Your system checks this file **before** querying DNS servers!

---

## DNS Resolution Order

1. **Browser cache**
2. **Operating system cache**
3. **`/etc/hosts` file** ⬅️ **THIS FILE** - checked before DNS!
4. **DNS resolver** ([[networking_interfaces]]'s `/etc/resolv.conf` - configured DNS servers like 8.8.8.8)

This is why editing `/etc/hosts` bypasses all [[networking_dns_tools]] queries!

---

## File Location

- **Linux/Mac**: `/etc/hosts`
- **Windows**: `C:\Windows\System32\drivers\etc\hosts`

---

## Format

```
# IP_ADDRESS    HOSTNAME    [ALIASES]
127.0.0.1       localhost
192.168.1.100   myserver.local myserver
93.184.216.34   example.com www.example.com
```

**Structure**:
- Lines starting with `#` are comments
- Format: `IP_ADDRESS` + whitespace + `HOSTNAME` + optional `ALIASES`
- Multiple aliases allowed per line
- Case-insensitive (hostnames)

---

## Common Use Cases

### Local Development
```
127.0.0.1       myapp.local
127.0.0.1       api.myapp.local
127.0.0.1       db.myapp.local
```
→ Access local services with friendly names instead of `localhost:8080`

### Block Domains (Ad Blocking)
```
0.0.0.0         ads.example.com
0.0.0.0         tracking.example.com
0.0.0.0         malware-site.com
```
→ Browser tries to connect to `0.0.0.0` (nowhere) = domain blocked!

### DNS Workaround (Your NXDOMAIN Fix!)
```
93.184.216.34   example.com
```
→ When DNS fails with NXDOMAIN, this forces the resolution locally

### Testing Before DNS Propagation
```
54.123.45.67    newserver.example.com
```
→ Test new server before DNS records are updated globally

### Multiple Aliases
```
192.168.1.50    jenkins.local jenkins ci
```
→ Access via `jenkins.local`, `jenkins`, or `ci`

---

## When to Use

✅ **Good for**:
- Temporary DNS issue workarounds
- Local development environments (avoid port numbers!)
- Testing before DNS propagation
- Blocking unwanted domains (privacy/security)
- Overriding DNS for specific domains
- Quick testing without modifying DNS servers

❌ **Not recommended for**:
- Permanent solutions (fix DNS properly!)
- Domains with load balancers (they use multiple IPs)
- Domains where IP changes frequently (CDNs)
- Production environments (doesn't scale)
- Sharing across team (each person needs to edit manually)

---

## Editing the File

```bash
# Linux/Mac
sudo nano /etc/hosts
# or
sudo vim /etc/hosts

# Windows (as Administrator)
notepad C:\Windows\System32\drivers\etc\hosts
```

**Note**: Requires root/administrator privileges (it's a system file).

### Example Session
```bash
$ sudo nano /etc/hosts

# Add this line:
192.168.1.100   myserver.local

# Save (Ctrl+O, Enter) and exit (Ctrl+X)
```

---

## Testing Changes

### Flush DNS Cache
After editing, flush cached DNS entries:

```bash
# Mac
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder  # Also restart DNS responder

# Linux (systemd)
sudo systemd-resolve --flush-caches

# Linux (nscd)
sudo /etc/init.d/nscd restart

# Windows (as Administrator)
ipconfig /flushdns
```

### Verify Changes

**Test with ping** ([[networking_connectivity]]):
```bash
$ ping myserver.local
PING myserver.local (192.168.1.100): 56 data bytes
64 bytes from 192.168.1.100: icmp_seq=0 ttl=64 time=1.234 ms
```
→ Resolves to your `/etc/hosts` entry!

**Test with dig** ([[networking_dns_tools]]):
```bash
$ dig myserver.local
# Will still query DNS (doesn't use /etc/hosts)
# But curl, ping, browsers DO use /etc/hosts
```
→ Note: `dig` bypasses `/etc/hosts`! Use `getent` instead:

```bash
$ getent hosts myserver.local
192.168.1.100   myserver.local
```
→ This uses `/etc/hosts`

**Test with curl** ([[networking_http_tools]]):
```bash
$ curl http://myserver.local
# Uses /etc/hosts, will connect to 192.168.1.100
```

---

## NXDOMAIN Workaround Example

**The Problem**: DNS can't resolve domain (NXDOMAIN error)

**Your Fix**:

```bash
# 1. Get IP from working DNS server
$ dig example.com @8.8.8.8
;; ANSWER SECTION:
example.com.  86400  IN  A  93.184.216.34
```
→ DNS server `8.8.8.8` knows the IP!

```bash
# 2. Add to /etc/hosts
$ sudo nano /etc/hosts
# Add this line:
93.184.216.34    example.com
```

```bash
# 3. Flush DNS cache
$ sudo dscacheutil -flushcache  # Mac
```

```bash
# 4. Test with ping
$ ping example.com
PING example.com (93.184.216.34): 56 data bytes
64 bytes from 93.184.216.34: icmp_seq=0 ttl=117 time=12.4 ms
```
→ **Works!** System used `/etc/hosts` instead of broken DNS

### Why This Worked
1. Your DNS resolver (from [[networking_interfaces]]'s `/etc/resolv.conf`) was returning NXDOMAIN
2. `/etc/hosts` is checked **BEFORE** DNS queries
3. System found `example.com` in `/etc/hosts` → used that IP
4. Never queried broken DNS server!

### When to Remove the Fix
Once DNS is working again:
```bash
# Test if DNS works now
$ dig example.com
# If it returns the correct IP, remove from /etc/hosts

$ sudo nano /etc/hosts
# Remove or comment out the line:
# 93.184.216.34    example.com
```

---

## Interpreting Behavior

### How to Tell if `/etc/hosts` is Being Used

**Check the file**:
```bash
$ cat /etc/hosts | grep example.com
93.184.216.34   example.com
```
→ Entry exists

**Use getent** (respects `/etc/hosts`):
```bash
$ getent hosts example.com
93.184.216.34   example.com
```
→ System uses this IP

**Compare with dig** (bypasses `/etc/hosts`):
```bash
$ dig +short example.com
93.184.216.35   # Different IP!
```
→ DNS says different IP, but system will use `/etc/hosts` (93.184.216.34)

### Common Issues

**Changes not taking effect?**
1. Flush DNS cache (see above)
2. Check syntax (no typos, correct whitespace)
3. Verify file permissions: `ls -l /etc/hosts` (should be readable by all)

**Application ignores `/etc/hosts`?**
- Some apps (like `dig`, `nslookup`) bypass `/etc/hosts` intentionally
- Most apps (browsers, `ping`, `curl`) respect it

---

## Real-World Examples

### Local Kubernetes Development
```
127.0.0.1       app.local
127.0.0.1       api.app.local
127.0.0.1       db.app.local
```
→ Access services by name instead of `localhost:8080`, `localhost:3000`, etc.

### Blocking Telemetry
```
0.0.0.0  telemetry.microsoft.com
0.0.0.0  vortex.data.microsoft.com
```

### Staging Environment Testing
```
54.123.45.67   staging.myapp.com
54.123.45.68   api.staging.myapp.com
```
→ Test staging servers before DNS points to them

---

# References

- [[networking_dns_tools]] - DNS tools (note: dig bypasses /etc/hosts)
- [/etc/hosts documentation](https://man7.org/linux/man-pages/man5/hosts.5.html)
- [DNS resolution order](https://www.ietf.org/rfc/rfc6761.txt)
- [nsswitch.conf](https://man7.org/linux/man-pages/man5/nsswitch.conf.5.html)

