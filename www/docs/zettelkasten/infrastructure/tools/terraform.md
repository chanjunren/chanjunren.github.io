🗓️ 08042026 1200

# terraform

**What it is:**
- **Infrastructure as Code (IaC)** tool by HashiCorp
- You declare the infrastructure you want (servers, networks, databases, DNS) in `.tf` files, and Terraform creates/modifies/destroys it to match
- Cloud-agnostic — works with AWS, GCP, Azure, DigitalOcean, and hundreds of other providers via plugins

**Why it exists:**
- Clicking through cloud consoles to create infrastructure is manual, error-prone, and not reproducible
- Shell scripts for provisioning are fragile, non-idempotent, and don't track what already exists
- Terraform maintains a **state file** that knows what it created, so it can diff desired vs actual and apply only the changes

## Core Workflow

### Write
- Define resources in HCL (HashiCorp Configuration Language)
- Declarative: describe *what* you want, not *how* to create it

### Plan
- `terraform plan` shows what will change — creates, modifies, or destroys
- Safe preview before touching anything
- Critical for production — always review the plan

### Apply
- `terraform apply` executes the changes
- Creates resources in dependency order (network before server, server before DNS record)
- Updates state file to reflect reality

### Destroy
- `terraform destroy` tears down everything Terraform manages
- Useful for ephemeral environments (dev, staging, per-client test environments)

## State File

The state file (`terraform.tfstate`) is Terraform's memory:
- Maps your config to real cloud resources (knows that `aws_instance.web` = `i-abc123`)
- Enables `plan` to diff desired vs actual
- **Must be stored securely** — contains resource IDs, sometimes secrets
- For teams: use remote state backend (S3 + DynamoDB, Terraform Cloud, etc.) — never commit to git

## How Terraform Differs From Other Tools

### Terraform vs Ansible/Chef/Puppet
- **Terraform**: provisions infrastructure (servers, networks, databases)
- **Ansible/Chef/Puppet**: configures what's *on* those servers (install packages, deploy apps)
- Terraform creates the VM; Ansible installs Docker on it
- They complement, not replace each other

### Terraform vs CloudFormation / Pulumi
- **CloudFormation**: AWS-only, YAML/JSON, tightly integrated with AWS
- **Pulumi**: IaC using real programming languages (TypeScript, Python, Go)
- **Terraform**: HCL (domain-specific but readable), multi-cloud, largest provider ecosystem
- Choose Terraform for multi-cloud or provider-agnostic; CloudFormation if purely AWS

### Terraform vs Docker/Kubernetes
- Different layer entirely
- **Terraform**: creates the infrastructure (VPS, managed database, load balancer, DNS)
- **Docker/Kubernetes**: runs applications on that infrastructure
- Pattern: Terraform provisions the server → Docker runs your containers on it

## When to Use

- Managing cloud resources that should be reproducible and version-controlled
- Multi-environment setups (dev/staging/prod from the same config with different variables)
- Per-client infrastructure isolation — spin up identical stacks with different parameters
- Need to destroy and recreate environments reliably

## When to Skip

- Single server you manage manually — Terraform adds overhead for minimal benefit
- Purely local Docker setup — no cloud resources to manage
- Managed platforms (Vercel, Railway, Render) that handle infrastructure for you

## Relevance to Your Docker Setup

For your multi-client single-server scenario:
- If you're on one VPS you manage yourself — Terraform is overkill right now
- If you grow to per-client VPS instances — Terraform shines: define a "client stack" module, instantiate it per client
- Terraform can provision the server, DNS records, firewall rules, and managed databases; Docker Compose handles what runs on the server
- The migration path: manual → Terraform when you need reproducible multi-server provisioning

## Key Concepts

### Providers
- Plugins that talk to cloud APIs (AWS, GCP, DigitalOcean, Cloudflare, etc.)
- Each provider exposes resources you can manage

### Resources
- The things Terraform creates: servers, databases, DNS records, firewall rules
- Each resource has a type and arguments

### Modules
- Reusable groups of resources — your own or from the Terraform Registry
- Package a "client stack" as a module, instantiate it with different variables per client

### Variables and outputs
- Variables parameterize your config (region, instance size, client name)
- Outputs expose values (IP address, database URL) for other tools or modules to consume

```ad-warning
**State file contains secrets and is the source of truth**: Losing or corrupting the state file means Terraform no longer knows what it manages — you'll have to import resources manually or risk duplicates. Always use remote state with locking for team use.
```

```ad-danger
**`terraform destroy` is irreversible**: It will delete real cloud resources. Always review the plan, and protect production state with access controls. Consider `prevent_destroy` lifecycle rules on critical resources.
```

---

## References

- https://developer.hashicorp.com/terraform/intro
- https://developer.hashicorp.com/terraform/language
- https://developer.hashicorp.com/terraform/tutorials
