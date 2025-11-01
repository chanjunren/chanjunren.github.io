🗓️ 04102025 0030

# Ports & Connections Tools

Tools for checking what ports are open and what's connected. Essential for debugging "port already in use" errors.

---

## `netstat` - Network Statistics (Legacy)

### Commands
```bash
netstat -tuln                # Listening ports (TCP/UDP)
netstat -an                  # All connections, numeric
netstat -anp                 # All connections with process names (Linux)
netstat -r                   # Routing table
netstat -i                   # Network interfaces
netstat -s                   # Protocol statistics
```

**Use for**: Checking open ports, viewing active connections, routing info.

**Note**: Being replaced by `ss` on modern Linux systems. Still common on macOS and older systems.

### Interpreting Output

```bash
$ netstat -tuln
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN
tcp        0      0 127.0.0.1:5432          0.0.0.0:*               LISTEN
tcp6       0      0 :::80                   :::*                    LISTEN
udp        0      0 0.0.0.0:68              0.0.0.0:*
```

**Key parts**:
- **Proto**: Protocol (`tcp`, `tcp6` = IPv6, `udp`)
- **Recv-Q/Send-Q**: Bytes in receive/send queue (should be ~0)
- **Local Address**: What's listening locally
  - `0.0.0.0:22` - Listening on all interfaces, port 22 (SSH)
  - `127.0.0.1:5432` - Listening on localhost only, port 5432 (PostgreSQL)
  - `:::80` - IPv6 listening on all interfaces, port 80 (HTTP)
- **Foreign Address**: Remote connection (for established connections)
- **State**: 
  - `LISTEN` - Waiting for connections
  - `ESTABLISHED` - Active connection
  - `TIME_WAIT` - Connection closing
  - `CLOSE_WAIT` - Remote end closed connection

**Common scenarios**:

**Find what's using port 8080**:
```bash
$ netstat -tuln | grep :8080
tcp        0      0 127.0.0.1:8080          0.0.0.0:*               LISTEN
```
→ Something is listening on port 8080 (localhost only)

**See all established connections**:
```bash
$ netstat -tn | grep ESTABLISHED
tcp        0      0 192.168.1.100:54321     93.184.216.34:443       ESTABLISHED
```
→ Your machine (192.168.1.100:54321) connected to remote server (93.184.216.34:443)

---

## `ss` - Socket Statistics (Modern)

### Commands
```bash
ss -tuln                     # Listening ports (TCP/UDP)
ss -tun                      # All TCP/UDP sockets
ss -t state established      # Established TCP connections
ss -p                        # Show process names
ss -s                        # Summary statistics
ss dst 192.168.1.1          # Filter by destination
ss sport = :80              # Filter by source port
```

**Use for**: Same as netstat but **much faster** and more powerful filtering.

**What it does**: Display socket statistics and network connections.

### Interpreting Output

```bash
$ ss -tuln
Netid State   Recv-Q Send-Q Local Address:Port  Peer Address:Port
tcp   LISTEN  0      128    0.0.0.0:22           0.0.0.0:*
tcp   LISTEN  0      128    127.0.0.1:5432       0.0.0.0:*
tcp   ESTAB   0      0      192.168.1.100:54321  93.184.216.34:443
```

**Similar to netstat, but:**
- **Netid**: Socket type (tcp, udp, etc.)
- **State**: Connection state (LISTEN, ESTAB = established)
- Faster performance on systems with many connections
- Better filtering capabilities

**Show process names** (`-p` requires sudo):
```bash
$ sudo ss -tulnp
Netid State  Local Address:Port  Process
tcp   LISTEN 0.0.0.0:22           users:(("sshd",pid=1234,fd=3))
tcp   LISTEN 127.0.0.1:5432       users:(("postgres",pid=5678,fd=5))
tcp   LISTEN 0.0.0.0:8080         users:(("node",pid=9012,fd=21))
```
→ Now you can see **which process** is using each port!

**Filter by state**:
```bash
$ ss -t state established
# Shows only active connections
```

---

## `lsof` - List Open Files/Ports

### Commands
```bash
lsof -i :8080               # What's using port 8080?
lsof -i tcp                 # All TCP connections
lsof -i -P                  # Show port numbers (no service names)
lsof -i -n                  # No hostname resolution (faster)
lsof -i tcp:1-1024          # Privileged ports
lsof -u username            # Network connections by user
```

**Use for**: Finding which **specific process** is using a port. Most direct way to answer "what's using port X?"

**What it does**: Lists open files, including network sockets (in Unix, network connections are files!).

### Interpreting Output

```bash
$ lsof -i :8080
COMMAND   PID   USER   FD   TYPE  DEVICE SIZE/OFF NODE NAME
node    12345  user   21u  IPv4  0x123   0t0     TCP *:8080 (LISTEN)
```

**Key parts**:
- **COMMAND**: Process name (`node`, `python`, etc.)
- **PID**: Process ID (use `kill 12345` to stop it)
- **USER**: Which user owns the process
- **FD**: File descriptor (`21u` = descriptor 21, read+write)
- **TYPE**: IPv4 or IPv6
- **NAME**: Connection details
  - `*:8080 (LISTEN)` - Listening on all interfaces, port 8080
  - `localhost:8080->localhost:54321 (ESTABLISHED)` - Active connection

**Common use cases**:

**Port already in use error?**
```bash
$ lsof -i :3000
COMMAND   PID  USER   FD   TYPE   NODE NAME
node    12345  user   21u  IPv4   TCP *:3000 (LISTEN)

# Kill it:
$ kill 12345
# Or force kill:
$ kill -9 12345
```

**See all connections for an app**:
```bash
$ lsof -c nginx  # All files/connections for nginx
```

**Find what's making external connections**:
```bash
$ lsof -i tcp -s TCP:ESTABLISHED
```

---

## Comparison: When to Use Which?

| Task | Best Tool | Command |
|------|-----------|---------|
| What's on port 8080? | `lsof` | `lsof -i :8080` |
| List all listening ports | `ss` or `netstat` | `ss -tuln` |
| Which process? (with PID) | `lsof` or `ss -p` | `sudo ss -tulnp` |
| Quick check on old system | `netstat` | `netstat -tuln` |
| Fast on many connections | `ss` | `ss -tuln` |

---

## References

- [netstat manual](https://linux.die.net/man/8/netstat)
- [ss manual](https://man7.org/linux/man-pages/man8/ss.8.html)
- [lsof manual](https://linux.die.net/man/8/lsof)

