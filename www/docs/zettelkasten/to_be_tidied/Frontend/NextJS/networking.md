---
sidebar_position: 1
sidebar_label: Networking
---

# Networking

### Origin Servers
> *Stores and runs original version of application code*
- Does computation and sends response upon receiving request
- Work can be moved to CDNs

### Content Delivery Network (CDNs)
> *Stores static content in multiple servers around the world*
- New request => CDN responds to user with cached result
- Reduces load on origin
- Also faster because the CDN server is at a location geographically closer


### The Edge (Servers)
> *Stores static content like CDN*
- Located closer to user
- Can handle both execution and caching
- Can make app more performant

### References
- [NextJS Official Documentation](https://nextjs.org/learn/foundations/how-nextjs-works)
