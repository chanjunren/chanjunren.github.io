🗓️ 15042026 1400

# nginx_config_structure

Cheatsheet for the standard nginx directory layout and how configs wire together. For nginx as a [[reverse_proxy]], see that note.

## Standard Directory Layout

Debian/Ubuntu default (`/etc/nginx/`):

```
/etc/nginx/
├── nginx.conf              # root config — the entry point
├── mime.types              # file extension → MIME type mapping
├── conf.d/                 # drop-in configs, auto-included
│   └── default.conf
├── sites-available/        # all vhost configs (including disabled)
│   ├── example.com.conf
│   └── api.example.com.conf
├── sites-enabled/          # symlinks to active configs
│   └── example.com.conf → ../sites-available/example.com.conf
└── snippets/               # reusable config fragments
    ├── proxy_params.conf
    ├── ssl_params.conf
    └── security_headers.conf
```

## nginx.conf — The Root

Everything starts here. It sets global defaults and `include`s everything else:

```nginx
user www-data;
worker_processes auto;
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # logging
    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    # performance
    sendfile on;
    keepalive_timeout 65;
    gzip on;

    # load all configs
    include /etc/nginx/conf.d/*.conf;
    include /etc/nginx/sites-enabled/*;
}
```

The `include` directives are what wire the directory structure together — nginx globs the paths and inlines every matching file.

## conf.d/ vs sites-enabled/

### conf.d/
- Drop files in, they're included automatically
- No enable/disable mechanism — file exists = active
- Simpler for Docker/containers where config is baked into the image

### sites-available/ + sites-enabled/
- **sites-available/**: all configs, including disabled ones
- **sites-enabled/**: symlinks to active configs
- Enable: `ln -s /etc/nginx/sites-available/foo.conf /etc/nginx/sites-enabled/`
- Disable: `rm /etc/nginx/sites-enabled/foo.conf` (symlink only, original stays)
- Debian/Ubuntu convention — not all distros use this

### Which to use
- **Docker / config-as-code**: `conf.d/` — no need for enable/disable, config is version-controlled
- **Traditional servers**: `sites-available/` + `sites-enabled/` — easy toggle without deleting files

## Snippets — Reusable Fragments

Common configs extracted into `snippets/` (or any directory), pulled in with `include`:

### proxy_params.conf
```nginx
# /etc/nginx/snippets/proxy_params.conf
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
proxy_http_version 1.1;
proxy_set_header Connection "";
```

### ssl_params.conf
```nginx
# /etc/nginx/snippets/ssl_params.conf
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 1d;
ssl_stapling on;
ssl_stapling_verify on;
```

### Using snippets in a server block
```nginx
# /etc/nginx/sites-available/example.com.conf
upstream app_backend {
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    listen 443 ssl;
    server_name example.com;

    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;
    include /etc/nginx/snippets/ssl_params.conf;

    location / {
        proxy_pass http://app_backend;
        include /etc/nginx/snippets/proxy_params.conf;
    }
}
```

## Upstreams

**Upstream blocks** define backend server groups for load balancing. Two placement patterns:

### Inline (small setups)
- Define `upstream` directly in the server block file
- Fine when one vhost uses one upstream

### Separate file (many services)
- `conf.d/upstreams.conf` or `snippets/upstreams.conf`
- All upstreams in one place, referenced by name from any server block
- Keeps vhost configs focused on routing

## Include Chain Summary

```
nginx.conf
  └─ include conf.d/*.conf        ← upstreams, global settings
  └─ include sites-enabled/*      ← per-domain server blocks
       └─ include snippets/ssl_params.conf
       └─ include snippets/proxy_params.conf
```

Nginx doesn't care about directory names — only the `include` paths in `nginx.conf` matter. Rename `sites-enabled/` to `domains/` or `vhosts/` and update the include path — same result.

## Common Commands

| Command | Purpose |
|---------|---------|
| `nginx -t` | Test config syntax before reload |
| `nginx -s reload` | Reload config without downtime |
| `nginx -T` | Dump full resolved config (all includes expanded) |
| `ln -s ../sites-available/foo.conf sites-enabled/` | Enable a site |
| `rm sites-enabled/foo.conf` | Disable a site |

```ad-warning
Always run `nginx -t` before `nginx -s reload`. A syntax error in any included file takes down the entire reload — and if the main process was stopped, nginx won't start at all.
```

```ad-example
`nginx -T` is invaluable for debugging. It outputs the fully resolved config with all `include` directives expanded inline, so you can see exactly what nginx sees — no more hunting across 10 files to find a conflicting directive.
```

---

## References

- https://nginx.org/en/docs/beginners_guide.html
- https://wiki.debian.org/Nginx/DirectoryStructure
- https://nginx.org/en/docs/ngx_core_module.html#include
