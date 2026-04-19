🗓️ 18042026 0000
📎 [[ssh]]

# ssh_keyscan

Utility that fetches a remote host's **public SSH host keys** without logging in. Used to pre-populate `known_hosts` so that first-time SSH/SCP/rsync connections don't prompt for interactive trust — critical in automation where no human is present to type "yes".

## Why it matters

SSH uses **Trust On First Use** (TOFU): on first connection, the client asks the user to verify the server's host key fingerprint, then caches it in `~/.ssh/known_hosts`. Subsequent connections check against that cached key to detect MITM swaps.

Automation breaks this model — scripts can't answer the prompt. Two bad workarounds exist:
- `StrictHostKeyChecking=no` — disables verification entirely, MITM-vulnerable
- Piping `yes` into ssh — same problem, just uglier

`ssh-keyscan` is the right answer: pre-seed `known_hosts` ahead of time so verification still happens, just without the prompt.

## Common usage

```bash
# Fetch host keys and append to known_hosts
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Specific key types (ed25519 is preferred for modern hosts)
ssh-keyscan -t ed25519,rsa github.com >> ~/.ssh/known_hosts

# Non-standard port
ssh-keyscan -p 2222 internal.example.com >> ~/.ssh/known_hosts

# Multiple hosts at once
ssh-keyscan host1 host2 host3 >> ~/.ssh/known_hosts

# Quiet mode — suppress banner/comment lines
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
```

The `-H` flag **hashes hostnames** in the output — same format OpenSSH writes by default. Prevents an attacker who reads `known_hosts` from enumerating every host you've ever connected to.

## Verifying what you fetched

`ssh-keyscan` on its own inherits the trust problem it's trying to solve — if you scan during a MITM, you cache the attacker's key. Verify against an out-of-band source:

```bash
# Compute fingerprint of the fetched key
ssh-keyscan github.com | ssh-keygen -lf -
# 256 SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU github.com (ED25519)
```

Compare the fingerprint to the vendor's published list (e.g. [GitHub's SSH key fingerprints](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints)).

## Typical automation pattern

CI/CD cloning a private repo over SSH:
```bash
mkdir -p ~/.ssh
ssh-keyscan -t ed25519 github.com >> ~/.ssh/known_hosts
git clone git@github.com:org/repo.git
```

Docker image baking in trusted hosts:
```dockerfile
RUN mkdir -p /root/.ssh && \
    ssh-keyscan -t ed25519 github.com >> /root/.ssh/known_hosts
```

```ad-warning
**Don't blindly scan in hostile networks**: `ssh-keyscan` trusts whatever responds on port 22. If run on an attacker-controlled network before fingerprints are verified, you'll cache the attacker's key and silently hand them future sessions. Always cross-check fingerprints against a vendor-published source, or distribute a pre-validated `known_hosts` file.
```

---

## References

- https://man.openbsd.org/ssh-keyscan
- https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/githubs-ssh-key-fingerprints
