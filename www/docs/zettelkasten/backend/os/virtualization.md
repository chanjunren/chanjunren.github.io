🗓️ 12112024 0930

# virtualization

**What it is:**
- Technology that creates isolated virtual versions of computing resources
- Abstracts physical hardware from software
- Enables multiple operating systems or applications to run on single physical machine

**Problem it solves:**
- Running multiple workloads on dedicated hardware is wasteful and inflexible
- Without virtualization: need separate physical machines for each application
- Result: Poor resource utilization, high costs, difficult migration

## Hardware vs OS-level Virtualization

**Hardware virtualization (VMs):**
- Each virtual machine runs complete OS with own kernel on top of hypervisor
- Full isolation between VMs
- Heavier resource overhead

**OS-level virtualization (containers):**
- Multiple isolated user spaces share same kernel
- Lightweight and fast
- Can only run applications compatible with host kernel
- See [[docker_overview]] for container details

Key distinction: VMs virtualize hardware (can run different OS types), containers virtualize OS (share kernel).

## Hypervisor Types

**Type 1 (Bare Metal):**
- Runs directly on hardware without host OS
- Examples: VMware ESXi, Hyper-V, KVM, Xen
- Better performance, lower overhead
- Used in production data centers and cloud infrastructure

**Type 2 (Hosted):**
- Runs on top of host OS
- Examples: VirtualBox, VMware Workstation, Parallels
- Easier to set up, more overhead
- Used for development and testing

Pattern: Type 1 for production workloads and server consolidation. Type 2 for development and desktop virtualization.

## VMs vs Containers

**VMs:**
- Full OS per instance, GBs in size, minutes to start
- Complete kernel isolation
- Use when need different OS types on same hardware, maximum security isolation, or legacy applications requiring specific OS versions

**Containers:**
- Shared kernel, MBs in size, seconds to start
- Process-level isolation
- Use when application-level isolation sufficient, need fast startup/scaling, want resource efficiency, or building microservices
- Covered in [[docker_overview]]

Pattern: VMs for OS isolation, containers for application isolation. Or combine: run containers within VMs for both levels.

## When to Use VMs

Use for:
- Multiple OS environments on single hardware
- Strong isolation between workloads for security
- Legacy application support requiring specific OS versions
- Disaster recovery with snapshots and migration
- Resource consolidation to reduce hardware costs
- Dev/test environments isolated from production

Skip for:
- Performance-critical applications where overhead unacceptable
- Simple application isolation (containers more lightweight)
- Resource-constrained environments
- Bare-metal performance required (GPUs, high-frequency trading)

## Key Benefits and Trade-offs

**Benefits:**
- Complete OS isolation
- Run different OS types on same hardware
- Strong security boundaries
- Hardware independence
- Easy backup/recovery with snapshots
- Live migration between hosts

**Drawbacks:**
- Resource overhead (each VM runs full OS)
- Slower startup times
- Larger storage requirements
- More complex management
- License costs for guest operating systems

## Virtualization in Cloud Computing

Cloud IaaS built on virtualization:
- AWS EC2, Azure VMs, Google Compute Engine
- On-demand virtual machines without managing physical hardware
- Cloud provider handles hypervisor layer

For container workloads in cloud, see [[docker_orchestration]] for managing containerized applications at scale.

## Common Pitfalls

```ad-warning
**Over-provisioning VMs**: Allocating too many resources (CPU, RAM) wastes capacity. VMs don't use what they're allocated, they use what they need. Monitor actual usage and right-size allocations.
```

```ad-danger
**VM sprawl**: Unmanaged VM creation leads to wasted resources and security risks. Implement VM lifecycle policies, regular audits, and automated cleanup of unused VMs.
```

---

## References

- https://www.vmware.com/topics/glossary/content/virtualization.html
- https://www.redhat.com/en/topics/virtualization/what-is-virtualization
- https://aws.amazon.com/what-is/virtualization/
