🗓️ 04102025 0030
📎

# Network Interface & Configuration Tools

Tools for viewing and configuring network interfaces, IP addresses, and routing.

---

## `ip` - Network Configuration (Modern)

### Commands
```bash
ip addr show                 # Show IP addresses
ip route show               # Show routing table
ip link show                # Show network interfaces
ip addr add 192.168.1.100/24 dev eth0  # Add IP address
ip route get 8.8.8.8        # Show route to specific IP
ip neigh                    # Show ARP table (MAC addresses)
ip -s link                  # Show interface statistics
```

**Use for**: Checking IPs, configuring network, viewing routing table.

**What it does**: Modern, powerful tool for network configuration on Linux.

### Interpreting Output

#### `ip addr show`
```bash
$ ip addr show
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host

2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast state UP
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::a00:27ff:fe4e:66a1/64 scope link
```

**Key parts**:
- **lo**: Loopback interface (localhost, always 127.0.0.1)
- **eth0**: Ethernet interface (or en0, wlan0, etc.)
- **State flags**:
  - `UP` - Interface is active
  - `LOWER_UP` - Cable plugged in/connected
  - `BROADCAST` - Supports broadcasting
- **inet 192.168.1.100/24**: IPv4 address with subnet mask (/24 = 255.255.255.0)
- **brd 192.168.1.255**: Broadcast address
- **scope global**: Globally routable (vs. `scope host` = localhost only)
- **mtu 1500**: Maximum transmission unit (packet size)

#### `ip route show`
```bash
$ ip route show
default via 192.168.1.1 dev eth0 proto static metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100
```

**Key parts**:
- **default via 192.168.1.1**: Default gateway (router) - where to send packets for unknown destinations
- **dev eth0**: Which interface to use
- **192.168.1.0/24**: Local network (packets to this range go directly, not through gateway)
- **src 192.168.1.100**: Source IP to use

**Use cases**:

**Find your IP address**:
```bash
$ ip addr show | grep "inet " | grep -v 127.0.0.1
    inet 192.168.1.100/24 brd 192.168.1.255 scope global eth0
```

**Check if interface is up**:
```bash
$ ip link show eth0
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> ...
```
→ `UP` means active

**See route to specific destination**:
```bash
$ ip route get 8.8.8.8
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.100
```
→ To reach 8.8.8.8, go through gateway 192.168.1.1

---

## `ifconfig` - Interface Configuration (Legacy)

### Commands
```bash
ifconfig                    # Show all interfaces
ifconfig eth0               # Show specific interface
ifconfig eth0 up            # Bring interface up
ifconfig eth0 down          # Bring interface down
```

**Use for**: Quick IP check on older Linux systems or macOS.

**Note**: Deprecated on modern Linux, replaced by `ip` command. Still default on macOS.

### Interpreting Output

```bash
$ ifconfig
eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255
        inet6 fe80::a00:27ff:fe4e:66a1  prefixlen 64  scopeid 0x20<link>
        ether 08:00:27:4e:66:a1  txqueuelen 1000  (Ethernet)
        RX packets 12345  bytes 8901234 (8.9 MB)
        TX packets 6789  bytes 456789 (456.7 KB)
```

**Key parts**:
- **UP**: Interface is active
- **RUNNING**: Cable connected
- **inet 192.168.1.100**: IPv4 address
- **netmask 255.255.255.0**: Subnet mask (/24)
- **ether 08:00:27:4e:66:a1**: MAC address
- **RX packets**: Received packets
- **TX packets**: Transmitted packets

---

## `/etc/resolv.conf` - DNS Configuration

### What It Is
Contains the DNS servers your system uses for name resolution (used by [[networking_dns_tools]]).

### Viewing
```bash
cat /etc/resolv.conf
```

### Example Content
```
nameserver 8.8.8.8
nameserver 1.1.1.1
search local.domain
domain example.com
```

**Key parts**:
- **nameserver**: DNS servers to query (in order)
  - `8.8.8.8` - Google DNS
  - `1.1.1.1` - Cloudflare DNS
  - Usually 1-3 servers listed
- **search**: Domains to append for non-FQDN lookups
  - If you type `ping server`, it tries `server.local.domain`
- **domain**: Default domain name

**Troubleshooting**:

**No nameservers listed?**
```bash
$ cat /etc/resolv.conf
# (empty or no nameserver lines)
```
→ DNS won't work! Add a nameserver:
```bash
echo "nameserver 8.8.8.8" | sudo tee -a /etc/resolv.conf
```

**Check which DNS server is actually used**:
```bash
$ dig example.com | grep SERVER
;; SERVER: 8.8.8.8#53(8.8.8.8)
```

**Common DNS servers**:
- `8.8.8.8`, `8.8.4.4` - Google DNS
- `1.1.1.1`, `1.0.0.1` - Cloudflare DNS
- `208.67.222.222`, `208.67.220.220` - OpenDNS

**Note**: Some systems (systemd-resolved, NetworkManager) auto-generate this file. Your changes may be overwritten!

---

## `/etc/hosts` - Local DNS Override

See [[networking_etc_hosts]] for detailed information.

**Quick summary**: This file is checked **before** DNS, so entries here override DNS resolution.

```bash
$ cat /etc/hosts
127.0.0.1       localhost
192.168.1.100   myserver.local
```

---

## Network Configuration Flow

```
1. Application needs to connect to "example.com"
   ↓
2. Check /etc/hosts first ([[networking_etc_hosts]])
   ↓ (not found)
3. Query DNS servers from /etc/resolv.conf
   ↓ (returns 93.184.216.34)
4. Check routing table (ip route show)
   ↓ (route via gateway 192.168.1.1)
5. Send packets out interface eth0
   ↓ (using source IP 192.168.1.100)
6. Connection established!
```

---

# References

- [ip manual](https://man7.org/linux/man-pages/man8/ip.8.html)
- [ifconfig manual](https://linux.die.net/man/8/ifconfig)
- [resolv.conf manual](https://man7.org/linux/man-pages/man5/resolv.conf.5.html)

