🗓️ 08042026 1600

# docker_learning_path

Suggested reading order for the Docker and deployment notes. Each section builds on the previous.

## 1. Foundations — What Docker Is

1. [[docker_overview]] — containers vs VMs, core components, when to use
2. [[docker_image]] — images, tags, base images, immutability
3. [[docker_layers]] — how layers work, caching, union filesystem, why layer order matters
4. [[docker_container]] — lifecycle, isolation, ephemeral by design
4. [[docker_volumes]] — persisting data beyond container lifecycle
5. [[docker_networking]] — drivers, service discovery, network isolation
6. [[docker_healthcheck]] — readiness detection for containers

## 2. Building Images

7. [[dockerfile_best_practices]] — layer ordering, .dockerignore, non-root user, COPY vs ADD
8. [[docker_multistage_build]] — separating build and runtime environments
9. [[docker_buildx]] — BuildKit, multi-platform builds, build secrets, caching
10. [[oci_spec]] — the open standard behind container images and runtimes
11. [[container_registries]] — push/pull workflow, tagging strategies, access control

## 3. Compose — Multi-Container Apps

12. [[docker_compose]] — defining and running multi-container stacks
13. [[docker_compose_dependencies]] — startup ordering, health conditions, init containers
14. [[docker_env_management]] — .env vs env_file, precedence, per-client secrets
15. [[docker_compose_profiles]] — activating service subsets per client
16. [[docker_compose_extends]] — DRY config reuse with extends, anchors, x- fragments
17. [[docker_resource_limits]] — CPU/memory limits, noisy neighbor prevention
18. [[docker_logging]] — logging drivers, rotation, per-client log separation

## 4. Security

19. [[container_escape]] — what it is, attack vectors, defenses for multi-client setups
20. [[tls_certificates]] — certificate types, Let's Encrypt, chain of trust
21. [[ocsp]] — certificate revocation checking, OCSP stapling
22. [[docker_tls_termination]] — reverse proxy TLS pattern for Docker deployments

## 5. Orchestration and Deployment

22. [[docker_orchestration]] — why orchestration, core capabilities, platform comparison
23. [[docker_swarm]] — Docker-native clustering, rolling updates, Swarm vs K8s
24. [[swarm_stacks]] — stacks as deployment units, lifecycle commands
25. [[swarm_overlay_networking]] — VXLAN tunneling, service discovery, routing mesh, required ports
26. [[swarm_secrets_and_configs]] — encrypted secrets and config distribution
27. [[swarm_scheduling]] — desired state reconciliation, placement constraints, service modes
28. [[deployment_strategies]] — overview and comparison of all strategies
25. [[rolling_deployment]] — incremental instance replacement
26. [[blue_green_deployment]] — two environments, instant rollback
27. [[canary_deployment]] — gradual traffic shifting with monitoring
28. [[kubernetes]] — architecture, concepts (for reference / future learning)

## Quick Reference

- [[docker_commands]] — command cheatsheet
