---
sidebar_position: 0
sidebar_label: SSH Cheatsheet
---

# SSH Cheatsheet

## SSHD Commands (Windows)
| Command                 | Description                       |
|------------------------ | --------------------------------- |
| Start-Service sshd      | Starting SSH server               |
| Stop-Service sshd       | Stopping SSH server               |
| Restart-Service sshd    | Restarting SSH server             |
| Get-Service  sshd       | Retrieving status of SSH server   |

:::info
SSH on Windows logs events to the Windows Event Log. You can use the Event Viewer GUI (eventvwr.msc) or PowerShell commands to view these logs. Typically, you'd be interested in the 'Operational' logs under 'Applications and Services Logs -> OpenSSH'.
:::

## SSH Commands (Unix)
| Command                                                                  | Description                    |
|------------------------------------------------------------------------- | ------------------------------ |
| ssh username@remost_host                                                 | Connect to remote system       |
| scp /path/to/source_file username@remote_host:/path/to/destination       | Copy files to a remote system  |
| ssh-keygen                                                               | Generate ssh key               |
| ssh-copy-id user@remote_host                                             | Copy public key to server      |
| ssh-add /path/to/private_key                                             | Add private key to SSH agent   |
| eval $(ssh-agent -s)                                                     | Start the agent                |
| ssh-add /path/to/private_key                                             | Add keys to the agent          |
| ssh -L local_port:localhost:remote_port user@remote_server               | Local port forwarding          |
| ssh -R remote_port:localhost:local_port user@remote_server               | Remote port forwarding         |
| sudo systemctl restart sshd                                              | Restart ssh server             |

## Some useful ssh flags
| Flag    | Description          |
|-------- | -------------------- |
| p       | Port                 |
| v       | Verbose              |
| vvv     | Max verbose level    |

## SSH Client
> Role: Initiates the SSH communication. Often a user's computer.
- Responsibilities:
  - Establishing a connection to the SSH server.
  - Authenticating itself to the server.
  - Running commands on the server or forwarding traffic.
  - Common Tools/Implementations: ssh (OpenSSH), PuTTY.

## SSH Server
> Role: Listens for incoming SSH connections and provides services to SSH clients.
- Responsibilities:
    - Authenticating the client.
    - Running commands or services requested by the client.
    - Providing a secure encrypted tunnel for data transfer.
- Common Tools/Implementations: `sshd (OpenSSH server)`

## SSH-Agent
> Role: Acts as a key manager for SSH. Keeps private keys loaded into memory for use without requiring the passphrase every time.
- Responsibilities:
   - Safely holding private keys in memory.
   - Using the in-memory keys to authenticate on behalf of the client without exposing the actual key or repeatedly asking for the passphrase.


## SSH Key Pair
> Role: Consists of a private key and a public key, used for public-key cryptography.
- Responsibilities:
    - Private Key: Must be kept secret. It is used to prove one's identity.
    - Public Key: Can be shared and added to the authorized_keys file on SSH servers to allow for password-less authentication.

## SSH Config File
> Role: Stores configurations for SSH client-side connections, making it easier to manage multiple SSH connections.
- Responsibilities:
    - Define host-specific configurations (aliases, user names, ports, identity files).
- Location:
  - User-specific: ~/.ssh/config
  - System-wide: /etc/ssh/ssh_config
   
## SSH Tunneling (Port Forwarding)
> Role: Securely forward traffic from one network port to another.
- Types:
  - Local Port Forwarding: Forward a local port to a port on the remote server.
  - Remote Port Forwarding: Forward a port from the remote server to a port on the local client or another server.
   
## SSH Daemon Config File
> Role: Configuration file for the SSH server (sshd).
- Responsibilities:
  - Define server-specific configurations (port, allowed users, authentication methods).
- Location: `/etc/ssh/sshd_config`
