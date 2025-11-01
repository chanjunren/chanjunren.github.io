🗓️ 11052025 2141

# mipmapping


> technique that consists of creating half a smaller version of a texture repeatedly until 1x1 texture

```ad-note
From my understanding, it's a GPU optimization technique
```

```ad-warning
Mitigate [moiré patterns](https://en.wikipedia.org/wiki/Moir%C3%A9_pattern) by specifying appropriate algorithms
```

- All texture variations are sent to the GPU
- GPU will choose the most appropriate version of the texture.

## Algorithms
### Minification filter
> Texture filtering that happens when pixels of texture < pixels of the render
> 
> In other words, the texture is too big for the surface, it covers

  - controls how the texture is sampled
  - how the final pixel color is calculated

### Magnification filter
> Texture filtering that happens when pixels of texture > pixels of the render

- Change using `magFilter` property
- Possible values
  - `THREE.NearestFilter` (default)
    - Cheaper
  - `THREE.LinearFilter`

```ad-note
Only use the mipmaps for the `minFilter` property. If you are using the `THREE.NearestFilter`, you don't need the mipmaps, and you can deactivate them with `colorTexture.generateMipmaps = false`:

```



---
## References
