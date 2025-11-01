🗓️ 14042025 1636

# liveness_checks
> Used to determine if an application is still running and should not be restarted
> 
> Answers the question: "Is the application alive or dead?"

### Purpose
Determine if the application is running correctly and not stuck in a deadlock or unrecoverable state

```ad-note
If a liveness check fails, the container orchestrator (like Kubernetes) will kill the container and attempt to restart it
```

### Use Case
- Useful for detecting if
	- An application has crashed 
	- Stuck in a bad state (e.g., deadlock or infinite loop)


---
## References
- ChatGPT
