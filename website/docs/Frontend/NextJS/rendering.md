---
sidebar_position: 2
sidebar_label: Rendering
---

> *Converting react code into HTML representation*<br/><br/>Takes place on either server or client

## Methods available on NextJS
### Pre-Rendering 
*fetching of external data and transformation of code happens before sending to client*
> #### 1: __Server-Side Rendering__
> *HTML of page generated for __each request__ on server*
> - Generated HTML / JS / JSON data to make pages interactive sent to client
> - __Hydration__: using JSON data and JS to make pages interactive e.g. attaching event listeners 

> #### 2: __Static Site Generation__ 
> *HTML generated on server, no server on runtime*
> - stored in a CDN
> - re-used for each request
> - [Incremental Static Regeneration](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration)

###  __Client-Side Rendering__ 
> *browser receives empty HTML shell with javascript instructions to construct UI*
- Standard React application uses client-side rendering
- NextJS Pre-Renders by default  

<br/>

:::tip

On NextJS, you can decide the rendering method on a page-by-page basis depending on your use case

To learn more about which rendering method is right for your specific use case, read <a href="https://nextjs.org/docs/basic-features/data-fetching/overview">data fetching docs</a>

:::
---

## References
- [NextJS Official Documentation](https://nextjs.org/learn/foundations/how-nextjs-works)
