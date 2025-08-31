🗓️ 05092025 1514
📎

# databricks_cluster_config

## 🎯 Core Configuration Fields
### cluster_name (String)
- Required: Yes
- When to use: Always set a descriptive name
- Best practices: Include environment, team, purpose (e.g., "prod-etl-daily", "dev-analytics")
- Limits: Max 100 characters

### spark_version (String)
- Required: Yes
- When to use LTS: Production workloads (stability)
- When to use latest: Development, new features
- Avoid: 
	- photon- versions (use runtime_engine instead)
- Reference: [Databricks Runtime Versions](https://docs.databricks.com/release-notes/runtime/releases.html)

### node_type_id 
- Required: Yes
- General Purpose (i3): Balanced CPU/memory, development
- Memory Optimized (r5): ETL, analytics, large datasets
- Compute Optimized (c5): CPU-intensive, streaming
- Reference: [AWS Instance Types](https://aws.amazon.com/ec2/instance-types/)

## ⚖️ Scaling Configuration
### autoscale
- When to use: Variable workloads, cost optimization
- Development: 1-3 workers
- Production ETL: 2-10 workers
- Analytics: 3-20 workers
- Mutually exclusive with: num_workers

### num_workers 
- When to use: Consistent workloads, ML training
- ML/Training: Fixed size for stability
- Streaming: Fixed size for predictable performance
- Mutually exclusive with: autoscale
## 💰 Cost Optimization
### autotermination_minutes (Long)
- Required: Highly recommended
- Range: 10-10000 minutes
- Development: 15-30 minutes
- Production: 60-120 minutes
### aws_attributes (AwsAttributes)
- SPOT_WITH_FALLBACK: 60% savings, production-safe
- SPOT: Maximum savings, dev/testing only
- ON_DEMAND: Highest reliability, mission-critical
- Reference: [Spot Instance Best Practices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html)

## 🚀 Performance Configuration
## runtime_engine (RuntimeEngine)
- PHOTON: SQL workloads, ETL, analytics (3x faster)
- STANDARD: ML, streaming, general compute
- Cost: Photon adds ~20% premium but 3x performance
- Reference: [Photon Engine](https://docs.databricks.com/compute/photon.html)
### spark_conf 
- Always enable: Adaptive Query Execution (AQE)
- ETL workloads: Enable Delta optimizations
- Large datasets: Tune partition settings
- Reference: [Spark Configuration](https://docs.databricks.com/compute/photon.html)

## 🔒 Security & Governance
### data_security_mode
- SINGLE_USER: Production, highest security, Unity Catalog
- USER_ISOLATION: Shared clusters, user separation
- NONE: Legacy, not recommended for new clusters
- Reference: [Data Security Modes](https://docs.databricks.com/security/compute.html)

### enable_local_disk_encryption 
- true: Production, compliance requirements
- false: Development, testing only

## 🏷️ Resource Management
### custom_tags
- Required for: Cost tracking, resource management
- Limit: 45 custom tags max
- Best practices: Environment, Team, Project, CostCenter

### policy_id 
- When to use: Enforce organizational standards
- Governance: Restrict instance types, regions, settings
- Cost control: Limit expensive configurations

### 🐳 Container & Advanced Options
### docker_image 
- When to use: Custom libraries, golden images
- Benefits: Consistent environments, faster startup
- Reference: Databricks Container Services
### init_scripts 
- When to use: Custom software installation, configuration
- Execution: Sequential order, before Spark starts


---
# References
- [Databricks Cluster Configuration](https://docs.databricks.com/clusters/configure.html)
- [AWS Instance Types](https://aws.amazon.com/ec2/instance-types/)
- [Photon Engine Guide](https://docs.databricks.com/compute/photon.html)
- [Spot Instance Best Practices](https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/spot-best-practices.html)
- [Databricks Runtime Releases](https://docs.databricks.com/release-notes/runtime/releases.html)
- [Unity Catalog Security](https://docs.databricks.com/data-governance/unity-catalog/index.html)
