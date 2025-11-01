🗓️ 10052025 2145

# textures_3js

```ad-summary
Images that will cover the surface of your geometries
```

## types

| type              | description                                                                                        |                                                            |
| ----------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| color (albedo)    | takes pixel of texture and apply them to the geometry                                              | ![](https://threejs-journey.com/assets/lessons/11/000.jpg) |
| alpha             | grayscale image where white is visible and black is not                                            | ![](https://threejs-journey.com/assets/lessons/11/001.jpg) |
| height            | grayscale image that will move vertices to create some relief (requires subdivision to be seen)    | ![](https://threejs-journey.com/assets/lessons/11/002.png) |
| normal            | for luring light into thinking face is **oriented differently** (performant way of adding details) | ![](https://threejs-journey.com/assets/lessons/11/003.jpg) |
| ambient occlusion | grayscale shadow for faking shadow                                                                 | ![](https://threejs-journey.com/assets/lessons/11/004.jpg) |
| metalness         | grayscale image for specifying metalness (white is metallic, non-metallic is black)                | ![](https://threejs-journey.com/assets/lessons/11/005.jpg) |
| roughness         | grayscale image that comes with metalness (white - rough, smooth -black)                           | ![](https://threejs-journey.com/assets/lessons/11/006.jpg) |

> metalness and roughness follows [[physically_based_rendering]] principles

```ad-warning
Take into account the color space of your texture
```

## components

| component      | description                      |
| -------------- | -------------------------------- |
| TextureLoader  | Loads textures                   |
| LoadingManager | For managing texture load events |

```ad-note
The `LoadingManager` is useful for managing the progress of loading Texture assets

Can uess it to manager a loading bar
```

## Texture format and optimisation

```ad-tldr
Elements to keep in mind when preparing textures
```

### The weight

> Important because textures have to be downloaded

- `.jpg` ()
  - lossy compression
  - usually lighter
- `.png` ()
  - lossless compression
  - usually heavier
- Try to apply the usual methods to get an acceptable image but as light as possible
- Use compression websites like [TinyPNG](https://tinypng.com/) (also works with jpg) or any software.

### The size

- Each pixel of the textures you are using will have to be stored on the GPU regardless of the image's weight
- GPU has storage limitations
- Automatically generated mipmapping increases the number of pixels that have to be stored

```ad-important
- Texture width and height must be a power of 2

- That is mandatory so that Three.js can divide the size of the texture by 2

```

## The data
- `jpg` files don't have an alpha channel
- can use alpha map


If you are using a normal texture (the purple one), you will probably want to have the exact values for each pixel's red, green, and blue channels, or you might end up with visual glitches. For that, you'll need to use a png because its lossless compression will preserve the values.


## Where to find textures

- Sources
  - [poliigon.com](http://poliigon.com/)
  - [3dtextures.me](http://3dtextures.me/)
  - [arroway-textures.ch](http://arroway-textures.ch/)
- Create your own
  - PhotoShop
  - [Substance Designer](https://www.adobe.com/products/substance3d-designer.html)

```ad-important
Always make sure that you have the right to use the texture if it's not for personal usage.
```

---

## References
