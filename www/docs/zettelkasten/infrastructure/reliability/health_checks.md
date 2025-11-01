🗓️ 03092024 1153

# health_checks

> General term that can encompass both [[liveness_checks]] and [[readiness_checks]]

### Purpose
- Determine whether a service or application is functioning as expected
- Used to monitor various aspects of an application
	- Example
		- Ability to respond to requests
		- Connection to a database
		- Availability of necessary resources.
- Monitor the overall health status of the application or service.

### Summary of Differences

| **Aspect**            | **Health Check**                                                       | **Liveness Check**                                                    | **Readiness Check**                                                     |
| --------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| **Purpose**           | Monitor overall health status.                                         | Check if the application is alive and should not be restarted.        | Check if the application is ready to accept traffic.                    |
| **Action on Failure** | Could trigger alerts or corrective actions depending on configuration. | Container is killed and restarted by orchestrator (e.g., Kubernetes). | Traffic is not routed to the instance until it passes readiness checks. |
| **Example Condition** | Service is up, connected to DB, and dependencies are healthy.          | Application is not deadlocked or crashed.                             | Application has fully started and all dependencies are ready.           |
| **Typical Use Cases** | Monitoring dashboards, alerts, CI/CD pipelines.                        | Detecting crashed containers, unresponsive services.                  | Rolling updates, scaling operations, ensuring smooth deployments.       |

---

## References
- ChatGPT