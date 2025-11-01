🗓️ 04102025 0030
📎 [[networking_connectivity]]

# Advanced Debugging Tools

Tools for deep packet-level analysis and network scanning.

---

## `tcpdump` - Packet Capture

### Commands
```bash
sudo tcpdump                        # Capture all packets
sudo tcpdump -i en0                 # Specific interface
sudo tcpdump port 80                # Capture HTTP traffic
sudo tcpdump host example.com       # Filter by host
sudo tcpdump src 192.168.1.100      # Filter by source IP
sudo tcpdump dst 93.184.216.34      # Filter by destination IP
sudo tcpdump -w capture.pcap        # Save to file
sudo tcpdump -r capture.pcap        # Read from file
sudo tcpdump -nn port 443           # HTTPS, no DNS/port resolution
sudo tcpdump -A port 80             # Show ASCII content (HTTP)
sudo tcpdump -X port 80             # Show hex and ASCII
sudo tcpdump -c 100                 # Capture 100 packets only
```

**Use for**: Deep debugging, security analysis, protocol analysis, seeing exactly what's on the wire.

**What it does**: Captures and analyzes network packets at the lowest level (Layer 2-4).

**Note**: Requires root/sudo privileges. Can generate LOTS of data.

### Interpreting Output

```bash
$ sudo tcpdump -i en0 -c 3
tcpdump: verbose output suppressed, use -v or -vv for full protocol decode
listening on en0, link-type EN10MB (Ethernet), capture size 262144 bytes

10:30:45.123456 IP 192.168.1.100.54321 > 93.184.216.34.443: Flags [S], seq 1234567, win 65535, length 0
10:30:45.145678 IP 93.184.216.34.443 > 192.168.1.100.54321: Flags [S.], seq 7654321, ack 1234568, win 29200, length 0
10:30:45.145789 IP 192.168.1.100.54321 > 93.184.216.34.443: Flags [.], ack 1, win 65535, length 0

3 packets captured
```

**Key parts**:
- **Timestamp**: `10:30:45.123456` - When packet was captured
- **Protocol**: `IP` - Internet Protocol (can be TCP, UDP, ICMP, etc.)
- **Source**: `192.168.1.100.54321` - Source IP and port
- **Destination**: `93.184.216.34.443` - Destination IP and port
- **Flags**: TCP flags
  - `[S]` - SYN (connection start)
  - `[S.]` - SYN-ACK (connection acknowledgment)
  - `[.]` - ACK (acknowledgment)
  - `[P]` - PUSH (data)
  - `[F]` - FIN (connection close)
  - `[R]` - RST (connection reset/refused)
- **seq/ack**: Sequence and acknowledgment numbers
- **length**: Payload size in bytes

**What the above shows**: TCP three-way handshake!
1. Client sends SYN
2. Server responds with SYN-ACK
3. Client sends ACK
→ Connection established

**Common filters**:

**Capture HTTP traffic only**:
```bash
sudo tcpdump -i en0 -A port 80
# -A shows ASCII content (you can see HTTP headers)
```

**Capture traffic to/from specific host**:
```bash
sudo tcpdump host example.com
```

**Capture DNS queries** (uses [[networking_dns_tools]]):
```bash
sudo tcpdump -i en0 port 53
```

**Capture and save for Wireshark analysis**:
```bash
sudo tcpdump -i en0 -w debug.pcap
# Open debug.pcap in Wireshark later
```

**Read saved capture**:
```bash
sudo tcpdump -r debug.pcap
```

**TCP connection issues?**:
```bash
sudo tcpdump -i en0 'tcp[tcpflags] & (tcp-rst) != 0'
# Shows connection resets (refused connections)
```

---

## `nmap` - Network Scanner

### Commands
```bash
nmap example.com                    # Scan common ports (1000 most common)
nmap -p 80,443 example.com         # Specific ports
nmap -p 1-65535 example.com        # All ports (slow! 65535 ports)
nmap -p- example.com               # All ports (shorthand)
nmap -sV example.com               # Detect service versions
nmap -O example.com                # Detect OS
nmap 192.168.1.0/24                # Scan entire subnet
nmap -sn 192.168.1.0/24            # Ping scan (host discovery, no port scan)
nmap -Pn example.com               # Skip ping, assume host is up
nmap -A example.com                # Aggressive scan (OS, version, scripts)
```

**Use for**: Security auditing, discovering open ports, service discovery, network mapping.

**What it does**: Network exploration and security scanning tool.

**Warning**: ⚠️ Only scan networks you own or have explicit permission to scan. Unauthorized scanning may be illegal!

### Interpreting Output

```bash
$ nmap example.com

Starting Nmap 7.93 ( https://nmap.org ) at 2025-10-04 00:30 SGT
Nmap scan report for example.com (93.184.216.34)
Host is up (0.012s latency).
Not shown: 997 filtered ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 5.23 seconds
```

**Key parts**:
- **Host is up**: Target is reachable (like [[networking_connectivity]])
- **Latency**: Response time
- **PORT**: Port number and protocol
- **STATE**:
  - `open` - Service accepting connections
  - `closed` - Port reachable but no service listening
  - `filtered` - Firewall blocking (no response)
- **SERVICE**: Likely service running (based on port number)

**Service version detection** (`-sV`):
```bash
$ nmap -sV example.com

PORT    STATE SERVICE VERSION
22/tcp  open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.5
80/tcp  open  http    nginx 1.18.0
443/tcp open  https   nginx 1.18.0
```
→ Now you see **exact versions** of running services

**OS detection** (`-O`, requires sudo):
```bash
$ sudo nmap -O example.com

Running: Linux 4.X|5.X
OS CPE: cpe:/o:linux:linux_kernel:4 cpe:/o:linux:linux_kernel:5
OS details: Linux 4.15 - 5.6
```
→ Guesses the operating system

**Subnet scan** (find all devices on network):
```bash
$ nmap -sn 192.168.1.0/24

Nmap scan report for 192.168.1.1
Host is up (0.001s latency).

Nmap scan report for 192.168.1.100
Host is up (0.005s latency).

Nmap scan report for 192.168.1.150
Host is up (0.003s latency).

Nmap done: 256 IP addresses (3 hosts up) scanned in 2.45 seconds
```
→ Found 3 devices on the network

**Use cases**:

**Check if specific port is open** (like [[networking_ports_connections]] but from outside):
```bash
nmap -p 8080 example.com
```

**Quick scan (faster)**:
```bash
nmap -F example.com  # Fast: scan 100 most common ports
```

**Check firewall rules**:
```bash
nmap -p 80,443 example.com
# If shows "filtered", firewall is blocking
```

---

## `wireshark` - GUI Packet Analyzer

### What It Is
Graphical packet analyzer - GUI version of tcpdump with powerful filtering and visualization.

**What it does**: 
- Visual packet inspection with color coding
- Protocol dissection (understands hundreds of protocols)
- Follow TCP/UDP streams
- Export specific packets
- Filter by anything (IP, port, protocol, content)

**Installation**:
```bash
brew install wireshark         # macOS
sudo apt install wireshark     # Ubuntu/Debian
```

### Key Features

**Display filters** (after capture):
```
ip.addr == 192.168.1.100       # Traffic to/from this IP
tcp.port == 80                 # HTTP traffic
http                           # Only HTTP packets
dns                            # Only DNS packets
tcp.flags.syn == 1             # SYN packets (connection attempts)
```

**Following TCP streams**:
- Right-click packet → Follow → TCP Stream
- See entire conversation (like viewing a complete HTTP request/response)

**Use cases**:
- Debugging API calls (see exact HTTP headers and body)
- Understanding protocol behavior
- Finding why connections fail (see TCP resets, timeouts)
- Security analysis

**Note**: Same ethical/legal concerns as nmap - only capture on networks you own!

---

## When to Use Advanced Tools

```
Basic troubleshooting:
  ping, dig, curl → [[networking_connectivity]], [[networking_dns_tools]], [[networking_http_tools]]
     ↓ Still broken?
Port/connection issues:
  netstat, ss, lsof → [[networking_ports_connections]]
     ↓ Still broken?
Deep packet analysis:
  tcpdump, nmap, wireshark → THIS FILE
```

**Use tcpdump/wireshark when**:
- Need to see actual packet content
- Debugging SSL/TLS handshake issues
- Verifying what data is actually sent
- Analyzing timing between packets

**Use nmap when**:
- Checking if firewall rules work
- Discovering what's on a network
- Security auditing
- Verifying port is actually open (from outside)

---

## References

- [[networking_connectivity]] - Start with basic tools first
- [tcpdump manual](https://www.tcpdump.org/manpages/tcpdump.1.html)
- [tcpdump examples](https://danielmiessler.com/study/tcpdump/)
- [nmap manual](https://nmap.org/book/man.html)
- [Wireshark docs](https://www.wireshark.org/docs/)

