🗓️ 04102025 0030
📎 [[networking_connectivity]]

# HTTP/Web Tools

Tools for testing HTTP/HTTPS endpoints and downloading files.

---

## `curl` - HTTP Testing

### Commands
```bash
curl https://example.com                  # GET request
curl -I https://example.com               # Headers only (HEAD request)
curl -v https://example.com               # Verbose (debugging)
curl -X POST https://api.example.com      # POST request
curl -H "Content-Type: application/json"  # Custom headers
curl -d '{"key":"value"}' https://api.com # Send data
curl --resolve example.com:443:1.2.3.4    # Force specific IP
curl -w "%{http_code}" https://example.com # Show status code
curl -L https://example.com               # Follow redirects
curl -k https://example.com               # Ignore SSL errors (insecure!)
```

**Use for**: Testing APIs, debugging HTTP issues, checking SSL certificates, testing endpoints.

**What it does**: Transfer data from/to servers, supports HTTP, HTTPS, FTP, and more.

### Interpreting Output

#### Basic GET Request
```bash
$ curl https://example.com
<!doctype html>
<html>
<head>
    <title>Example Domain</title>
...
```
- Shows response body (HTML, JSON, etc.)
- Silent about errors (use `-v` for details)

#### Headers Only (`-I`)
```bash
$ curl -I https://example.com
HTTP/2 200
content-type: text/html; charset=UTF-8
date: Fri, 04 Oct 2025 00:30:00 GMT
server: nginx
content-length: 1256
```

**Key headers**:
- **HTTP/2 200**: Protocol version and status code
  - `200` - OK
  - `301/302` - Redirect (use `-L` to follow)
  - `404` - Not Found
  - `500` - Server Error
  - `403` - Forbidden
- **content-type**: What kind of data (HTML, JSON, etc.)
- **server**: Web server software
- **date**: Server's timestamp
- **content-length**: Response size in bytes

#### Verbose Mode (`-v`)
```bash
$ curl -v https://example.com
* Trying 93.184.216.34:443...
* Connected to example.com (93.184.216.34) port 443 (#0)
* TLS 1.3 connection using TLS_AES_256_GCM_SHA384
> GET / HTTP/2
> Host: example.com
> User-Agent: curl/7.88.1
> Accept: */*
>
< HTTP/2 200
< content-type: text/html
...
```

**Key parts**:
- **`*`** lines: Connection info (DNS, TLS handshake)
- **`>`** lines: Request sent to server
- **`<`** lines: Response from server
- Useful for debugging SSL issues, DNS problems, redirects

**Common curl scenarios**:

**Testing API endpoint**:
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com"}'
```

**Check if website is up**:
```bash
curl -I -w "%{http_code}\n" -o /dev/null -s https://example.com
# Returns: 200 (or other status code)
```

**Debug SSL certificate**:
```bash
curl -v https://example.com 2>&1 | grep -A 5 "Server certificate"
```

**Test with specific DNS** (like [[networking_etc_hosts]] but temporary):
```bash
curl --resolve example.com:443:93.184.216.34 https://example.com
```

---

## `wget` - Download Files

### Commands
```bash
wget https://example.com/file.zip
wget -c https://example.com/file.zip      # Continue interrupted download
wget -r https://example.com               # Recursive download (whole site)
wget --spider https://example.com         # Check if exists (don't download)
wget -O output.zip https://example.com/file.zip  # Save with specific name
wget -q https://example.com/file.zip      # Quiet mode
wget --limit-rate=200k https://example.com/file.zip  # Limit bandwidth
```

**Use for**: Downloading files, mirroring websites, batch downloads, scripts.

**What it does**: Non-interactive network downloader (good for scripts, can resume downloads).

### Interpreting Output

```bash
$ wget https://example.com/file.zip
--2025-10-04 00:30:00--  https://example.com/file.zip
Resolving example.com (example.com)... 93.184.216.34
Connecting to example.com (example.com)|93.184.216.34|:443... connected.
HTTP request sent, awaiting response... 200 OK
Length: 10485760 (10M) [application/zip]
Saving to: 'file.zip'

file.zip          100%[=========>]  10.00M  5.21MB/s    in 1.9s

2025-10-04 00:30:02 (5.21 MB/s) - 'file.zip' saved [10485760/10485760]
```

**Key parts**:
- **Resolving**: DNS lookup (uses [[networking_dns_tools]])
- **Connecting**: Establishing connection (like [[networking_connectivity]])
- **HTTP request sent**: Waiting for response
- **200 OK**: Success (same status codes as curl)
- **Length**: File size
- **Progress bar**: Download progress
- **Speed**: Download rate

**Common wget scenarios**:

**Resume interrupted download**:
```bash
wget -c https://example.com/large-file.iso
# Can stop and restart, picks up where it left off
```

**Download quietly (for scripts)**:
```bash
wget -q https://example.com/file.zip
# No output, check exit code: 0 = success
```

**Check if file exists without downloading**:
```bash
wget --spider https://example.com/file.zip
# Returns: HTTP response status
```

**Mirror a website**:
```bash
wget -r -np -k https://example.com
# -r: recursive
# -np: don't go to parent directories  
# -k: convert links for local viewing
```

---

# References

- [[networking_connectivity]] - Use ping first to check if host is reachable
- [curl manual](https://curl.se/docs/manual.html)
- [wget manual](https://www.gnu.org/software/wget/manual/wget.html)
- [HTTP status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)

