🗓️ 14042025 1637
📎

# readiness_checks
> Determines if an application is ready to start accepting traffic

## Purpose 
-  Crucial for ensuring:
	- Application is fully initialized 
	- Has its dependencies ready before starting to serve requests

```ad-note
If this check fails, the container orchestrator will not route traffic to that instance, and it will also not restart the container
```
 
## Use Case
- Useful for scenarios where an application needs time to:
	-  Initialize 
	- Wait for dependencies to be ready


---
# References
- ChatGPT