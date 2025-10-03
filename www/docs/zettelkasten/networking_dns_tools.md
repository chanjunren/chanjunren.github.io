🗓️ 04102025 0030
📎

# DNS Tools

Tools for querying DNS (Domain Name System) to resolve hostnames to IP addresses.

---

## `dig` - DNS Lookup (Most Powerful)

### Commands
```bash
dig example.com              # A record (IPv4)
dig example.com MX           # Mail servers
dig example.com NS           # Nameservers
dig @8.8.8.8 example.com    # Query Google DNS
dig +trace example.com       # Full resolution path
dig +short example.com       # Concise output
dig example.com ANY          # All available records
```

**Use for**: DNS troubleshooting, checking propagation, verifying records.

### Interpreting Output

```bash
$ dig example.com

; <<>> DiG 9.10.6 <<>> example.com
;; QUESTION SECTION:
;example.com.                   IN      A

;; ANSWER SECTION:
example.com.            86400   IN      A       93.184.216.34

;; Query time: 12 msec
;; SERVER: 8.8.8.8#53(8.8.8.8)
;; WHEN: Fri Oct 04 00:30:00 SGT 2025
;; MSG SIZE  rcvd: 56
```

**Key parts**:
- **QUESTION SECTION**: What you asked for (`A` record for `example.com`)
- **ANSWER SECTION**: The response
  - `example.com.` - The domain (trailing dot = fully qualified)
  - `86400` - TTL (Time To Live) in seconds (how long to cache)
  - `IN` - Internet class
  - `A` - Record type (IPv4 address)
  - `93.184.216.34` - The actual IP address
- **Query time**: How long the query took
- **SERVER**: Which DNS server responded

**Common record types**:
- `A` - IPv4 address
- `AAAA` - IPv6 address
- `MX` - Mail server (with priority number)
- `NS` - Nameserver
- `CNAME` - Canonical name (alias)
- `TXT` - Text records (SPF, DKIM, verification)

**Troubleshooting tips**:
- No ANSWER section? → Domain doesn't exist or no record of that type
- `NXDOMAIN` status? → Domain doesn't exist (see [[networking_etc_hosts]] for workaround)
- `SERVFAIL` status? → DNS server error
- High query time? → DNS server slow or network issues (use [[networking_connectivity]] tools)

---

## `nslookup` - Simple DNS Lookup

### Commands
```bash
nslookup example.com         # Simple lookup
nslookup example.com 8.8.8.8 # Query specific DNS server
nslookup -type=MX example.com   # Mail records
nslookup -type=NS example.com   # Nameservers
```

**Use for**: Quick DNS checks when you don't need dig's detail. Cross-platform (Windows/Mac/Linux).

### Interpreting Output

```bash
$ nslookup example.com
Server:         8.8.8.8
Address:        8.8.8.8#53

Non-authoritative answer:
Name:   example.com
Address: 93.184.216.34
```

**Key parts**:
- **Server**: DNS server that answered your query
- **Non-authoritative answer**: Response from cache (not the authoritative nameserver)
- **Name**: The domain you queried
- **Address**: The resolved IP address

---

## `host` - Simple DNS Lookup

### Commands
```bash
host example.com             # Simple lookup
host -t MX example.com       # Mail records
host -t NS example.com       # Nameservers
host -a example.com          # All records
```

**Use for**: Even simpler than `nslookup`, clean one-line output.

### Interpreting Output

```bash
$ host example.com
example.com has address 93.184.216.34
example.com has IPv6 address 2606:2800:220:1:248:1893:25c8:1946

$ host -t MX example.com
example.com mail is handled by 10 mail.example.com.
```

**Key parts**:
- Direct, human-readable output
- For MX records: Number (e.g., `10`) is priority (lower = higher priority)

---

## `whois` - Domain Registration Info

### Commands
```bash
whois example.com            # Domain registration info
whois 8.8.8.8               # IP ownership
```

**Use for**: Finding domain owner, expiration date, registrar information.

### Interpreting Output

```bash
$ whois example.com

Domain Name: EXAMPLE.COM
Registry Domain ID: 2336799_DOMAIN_COM-VRSN
Registrar: RESERVED-Internet Assigned Numbers Authority
Creation Date: 1995-08-14T04:00:00Z
Registry Expiry Date: 2023-08-13T04:00:00Z
Registrar: IANA
Registrar Abuse Contact Email: abuse@iana.org

Name Server: A.IANA-SERVERS.NET
Name Server: B.IANA-SERVERS.NET

Registrant Organization: Internet Assigned Numbers Authority
Registrant State/Province: CA
Registrant Country: US
```

**Key information**:
- **Creation Date**: When domain was first registered
- **Registry Expiry Date**: When domain expires (if not renewed)
- **Name Server**: Authoritative DNS servers for this domain
- **Registrant**: Who owns the domain
- **Registrar**: Company managing the registration

**Use cases**:
- Check if domain is about to expire
- Find who to contact about a domain
- Verify nameservers are correct
- Check IP block ownership

---

# References

- [dig manual](https://linux.die.net/man/1/dig)
- [DNS records explained](https://www.cloudflare.com/learning/dns/dns-records/)

