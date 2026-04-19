🗓️ 19042026 0000
📎 [[swarm_overlay_networking]]

# vxlan

**Virtual Extensible LAN** — tunneling protocol that makes hosts on different physical networks look like they're on the same flat Layer 2 segment. Wraps **Ethernet frames inside UDP packets** so container/VM traffic can cross routed IP networks without knowing the underlay exists.

## Problem it solves

Traditional **VLANs** (802.1Q) tag Ethernet frames with a 12-bit ID — cap of **4,094 networks** and everything has to sit on the same Layer 2 broadcast domain. Breaks down for:

- Multi-tenant clouds needing tens of thousands of isolated networks
- Containers/VMs on hosts across data centres, where Layer 2 can't physically reach
- Overlay networks like [[swarm_overlay_networking]] and Kubernetes CNI plugins (Flannel, Calico VXLAN mode) that need hosts anywhere to join one logical network

VXLAN gives a **24-bit VNI (VXLAN Network Identifier)** — ~16 million isolated segments — and transports them over plain UDP/IP so any routable connection between hosts is enough.

## How it works

```
┌─────────────────────────────────────────────────────────┐
│ Outer IP (host A) → Outer IP (host B)                   │
│   Outer UDP (dst port 4789)                             │
│     VXLAN header (VNI = 42, 24-bit)                     │
│       Inner Ethernet frame (container A → container B)  │
└─────────────────────────────────────────────────────────┘
```

1. Container A sends an Ethernet frame to container B
2. Host A's **VTEP** (VXLAN Tunnel Endpoint) wraps the frame in UDP, adds a VXLAN header with the VNI
3. Packet travels over the regular IP underlay
4. Host B's VTEP strips the outer headers, delivers the inner frame to container B

Neither container knows tunneling happened — they see a normal LAN.

### Key terms

- **VTEP** — endpoint that encapsulates/decapsulates. Usually a kernel device (`vxlan0`) on each host
- **VNI** — 24-bit segment ID. Equivalent role to VLAN tag, vastly larger space
- **Underlay** — the real routed IP network carrying the UDP packets
- **Overlay** — the virtual Layer 2 network the containers/VMs see
- **UDP port 4789** — IANA-assigned destination port (Linux default). Older deployments sometimes used 8472.

## MAC learning

Classic Ethernet learns MACs by flooding unknown traffic. VXLAN can do the same via **IP multicast** on the underlay, but many overlays avoid multicast by using a control plane:

- **EVPN** (BGP Ethernet VPN) — distributes MAC/VNI/VTEP mappings via BGP, no flooding
- **Flannel VXLAN** — Kubernetes API distributes VTEP info
- **Docker Swarm** — Serf gossip (port 7946) propagates endpoint state

Control-plane mode replaces multicast flooding with directed unicast — works in any cloud where multicast is blocked.

## Trade-offs

### Overhead
- Adds **50 bytes** per packet (outer Ethernet + IP + UDP + VXLAN header)
- Pushes typical container MTU down from 1500 → **1450** — misconfigured MTU causes silent fragmentation and throughput cliffs
- Encapsulation/decapsulation uses CPU unless offloaded to the NIC (most modern NICs support VXLAN TSO/RSS)

### No encryption by default
- VXLAN itself is plaintext UDP — anyone sniffing the underlay sees inner frames
- Overlays bolt on IPsec (Docker Swarm `--opt encrypted`, Calico WireGuard) when traffic crosses untrusted links

## Where you'll see it

| Product | VXLAN role |
|---|---|
| Docker Swarm overlay networks | Default encapsulation, UDP 4789 |
| Kubernetes Flannel (vxlan backend) | Pod-to-pod across nodes |
| Kubernetes Calico (vxlan mode) | Alternative to IP-in-IP when underlay blocks it |
| VMware NSX, OpenStack Neutron | Multi-tenant virtual networks |
| Data centre fabrics (EVPN-VXLAN) | Stretched L2 across racks/sites |

```ad-warning
**MTU mismatches are the classic VXLAN bug**: underlay MTU 1500 + 50 bytes VXLAN overhead means container MTU must drop to 1450 (or underlay jumbo frames enabled). Symptoms are small packets working fine while large transfers hang — TCP handshake passes, bulk data silently drops.
```

```ad-example
In [[swarm_overlay_networking]], each overlay network gets a VNI. Container A on host 1 sending to container B on host 3: host 1's VTEP wraps the frame with that VNI and sends UDP/4789 to host 3; host 3's VTEP unwraps and delivers. Hosts 1 and 3 just need IP reachability — same subnet, across racks, or across regions, VXLAN doesn't care.
```

---

## References

- https://datatracker.ietf.org/doc/html/rfc7348
- https://www.kernel.org/doc/Documentation/networking/vxlan.txt
- https://docs.docker.com/engine/network/drivers/overlay/
