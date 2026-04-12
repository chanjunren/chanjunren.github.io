# ssh

**What it is:**
- **Secure Shell** — protocol for encrypted remote access to machines over an untrusted network
- Gives you a terminal session on a remote server, with all traffic encrypted end-to-end
- Uses the same asymmetric + symmetric encryption model as [[tls]] — asymmetric for authentication/key exchange, symmetric for bulk data

**Problem it solves:**
- Before SSH: `telnet` and `rsh` sent everything (including passwords) in plaintext
- Need to administer servers, transfer files, and tunnel traffic without eavesdroppers seeing your commands or credentials

## Authentication Methods

### Password authentication
- Server prompts for password, you type it
- Simple but weaker — vulnerable to brute force, phishing
- Most production servers disable this in favor of key-based auth

### Key-based authentication (preferred)
1. Generate a **key pair** on your local machine: `ssh-keygen -t ed25519`
   - **Private key**: stays on your machine, never shared (`~/.ssh/id_ed25519`)
   - **Public key**: copied to the server (`~/.ssh/authorized_keys`)
2. When you connect, the server sends a challenge
3. Your client proves it holds the private key (without sending the key itself)
4. Server checks against the public key on file — if it matches, you're in

Same concept as [[tls_certificates]] — the private key proves your identity without ever crossing the network.

## SSH Agent

- Background process that holds your unlocked private keys in memory
- You unlock your key once (with passphrase), the agent handles subsequent authentications
- `ssh-add` loads a key into the agent; `ssh-add -l` lists loaded keys
- **Agent forwarding** (`ssh -A`): lets you authenticate from a remote server using keys on your local machine — the remote server never sees your private key

This is what [[docker_buildx]] uses with `--ssh` — forwards your agent into the build container so it can clone private repos without baking keys into image layers.

## Common Use Cases

### Remote login
```bash
ssh user@192.168.1.100        # password or key auth
ssh -i ~/.ssh/mykey user@host # specific private key
```

### File transfer
- `scp file.txt user@host:/path/` — simple copy over SSH
- `sftp user@host` — interactive file transfer session
- `rsync -e ssh` — efficient sync with delta transfer

### Port forwarding (tunneling)
```bash
# Local forward: access remote service through local port
ssh -L 5432:localhost:5432 user@bastion
# Now localhost:5432 reaches the remote server's PostgreSQL

# Remote forward: expose local service to the remote side
ssh -R 8080:localhost:3000 user@server
```

Useful for reaching databases or internal services that are only accessible from the server.

### Git authentication
- `git@github.com:user/repo.git` uses SSH under the hood
- GitHub/GitLab check your SSH public key to identify you — no password needed

## SSH Config

`~/.ssh/config` lets you define shortcuts and per-host settings:
```
Host myserver
    HostName 192.168.1.100
    User deploy
    IdentityFile ~/.ssh/deploy_key
    Port 2222
```
Now `ssh myserver` expands to the full connection details.

## Security Practices

- Use **Ed25519** keys (modern, fast, short) — avoid RSA unless compatibility requires it
- Protect private keys with a **passphrase** + SSH agent
- Disable **password authentication** on servers (`PasswordAuthentication no` in `sshd_config`)
- Disable **root login** (`PermitRootLogin no`) — use a regular user + `sudo`
- **Known hosts** (`~/.ssh/known_hosts`): SSH remembers each server's public key on first connect — warns you if it changes (possible MITM attack)

```ad-warning
**Agent forwarding to untrusted servers is risky**: A compromised server with agent forwarding can use your loaded keys to authenticate as you to other servers. Only use `-A` with servers you trust, or prefer `ProxyJump` (`ssh -J bastion target`) which doesn't expose your agent.
```

```ad-example
**First connection trust**: When you SSH to a new server, you see "The authenticity of host can't be established... Are you sure you want to continue?" — this is SSH asking you to verify the server's public key fingerprint. Once accepted, it's saved in `known_hosts` and future connections are verified automatically.
```

---

## References

- https://man7.org/linux/man-pages/man1/ssh.1.html
- https://www.openssh.com/manual.html
- https://docs.github.com/en/authentication/connecting-to-github-with-ssh
