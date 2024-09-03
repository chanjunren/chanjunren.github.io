🗓️ 03092024 1153
📎 #resilience #microservices

# health_live_readiness_checks
## Health Check
> General term that can encompass both liveness and readiness checks

### Purpose
- Determine whether a service or application is functioning as expected
- Used to monitor various aspects of an application
	- Example
		- Ability to respond to requests
		- Connection to a database
		- Availability of necessary resources.
- Monitor the overall health status of the application or service.

## Liveness Check
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

## Readiness Check
> Determines if an application is ready to start accepting traffic

### Purpose
-  Crucial for ensuring:
	- Application is fully initialized 
	- Has its dependencies ready before starting to serve requests

```ad-note
If this check fails, the container orchestrator will not route traffic to that instance, and it will also not restart the container
```
 
### Use Case
- Useful for scenarios where an application needs time to:
	-  Initialize 
	- Wait for dependencies to be ready

### Summary of Differences

| **Aspect**            | **Health Check**                                                       | **Liveness Check**                                                    | **Readiness Check**                                                     |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Purpose**           | Monitor overall health status.                                         | Check if the application is alive and should not be restarted.        | Check if the application is ready to accept traffic.                    |
| **Action on Failure** | Could trigger alerts or corrective actions depending on configuration. | Container is killed and restarted by orchestrator (e.g., Kubernetes). | Traffic is not routed to the instance until it passes readiness checks. |
| **Example Condition** | Service is up, connected to DB, and dependencies are healthy.          | Application is not deadlocked or crashed.                             | Application has fully started and all dependencies are ready.           |
| **Typical Use Cases** | Monitoring dashboards, alerts, CI/CD pipelines.                        | Detecting crashed containers, unresponsive services.                  | Rolling updates, scaling operations, ensuring smooth deployments.       |

---

# References
- ChatGPT