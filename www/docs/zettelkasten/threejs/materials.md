🗓️ 29042024 1830
📎

# materials

- **materials** - used to put a color on each visible pixel of the geometries
- **shaders** - programs that decide on the color of each pixel
- Three.js has many built-in materials with pre-made shaders

```javascript
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("./textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load(
  "./textures/door/metalness.jpg"
);
const doorRoughnessTexture = textureLoader.load(
  "./textures/door/roughness.jpg"
);
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

doorColorTexture.colorSpace = THREE.SRGBColorSpace;
matcapTexture.colorSpace = THREE.SRGBColorSpace;

const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });
```

```ad-info
- textures used as `map` and `matcap` are supposed to be encoded in `sRGB` 

- `colorSpace` needs to be set
```

![](https://threejs-journey.com/assets/lessons/12/003.jpg)

## MeshBasicMaterial

```javascript
const material = new THREE.MeshBasicMaterial({
  map: doorColorTexture,
});

// Equivalent
const material = new THREE.MeshBasicMaterial();
material.map = doorColorTexture;
```

### Map

```javascript
material.map = doorColorTexture;
```

> apply a texture on the surface of the geometry

### Color

```javascript
// material.map = doorColorTexture
material.color = new THREE.Color("#ff0000");
material.color = new THREE.Color("#f00");
material.color = new THREE.Color("red");
material.color = new THREE.Color("rgb(255, 0, 0)");
material.color = new THREE.Color(0xff0000);
```

> applies a uniform color on the surface of the geometry

![](https://threejs-journey.com/assets/lessons/12/004.jpg)

```javascript
material.map = doorColorTexture;
material.color = new THREE.Color("#ff0000");
```

> tints the texture with the Color

![](https://threejs-journey.com/assets/lessons/12/005.jpg)

### Wireframe

```javascript
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
material.wireframe = true;
```

> show the triangles that compose your geometry

![](https://threejs-journey.com/assets/lessons/12/006.jpg)

### Opacity

```javascript
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
// material.wireframe = true
material.transparent = true;
material.opacity = 0.5;
```

![](https://threejs-journey.com/assets/lessons/12/007.jpg)

### AlphaMap

```javascript
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
// material.wireframe = true
material.transparent = true;
// material.opacity = 0.5
material.alphaMap = doorAlphaTexture;
```

> for controlling transparency

### Side

```javascript
// material.map = doorColorTexture
// material.color = new THREE.Color('#ff0000')
// material.wireframe = true
// material.transparent = true
// material.opacity = 0.5
// material.alphaMap = doorAlphaTexture
material.side = THREE.DoubleSide;
```

- `FrontSide` (default), `BackSide`, `DoubleSide`
- avoid `DoubleSide` when possible

## MeshNormalMaterial

```javascript
const material = new THREE.MeshNormalMaterial();
```

![](https://threejs-journey.com/assets/lessons/12/010.jpg)

- use cases
- Calculating illumination / reflection / refraction
- Normal relative to camera
- Has `MeshBasicMaterial` properties
-

![](https://threejs-journey.com/assets/lessons/12/011.png)

```javascript
material.flatShading = true;
```

> flattens the surfaces (normals not interpolated between vertices)

![](https://threejs-journey.com/assets/lessons/12/012.jpg)

## MeshMatcapMaterial

- looks great and is performant
- Requires sphere looking texture
- Similar concept to baking? (final result is not responsive to light changes)
- Sources
  - [https://github.com/nidorx/matcaps](https://github.com/nidorx/matcaps)

```ad-warning
Note that licenses aren’t all verified and you might not be allowed to use them other than for personal projects.

```

- Creating your own
  - [https://www.kchapelier.com/matcap-studio/](https://www.kchapelier.com/matcap-studio/)
  - Photoshop

![](https://threejs-journey.com/assets/lessons/12/013.jpg)

```javascript
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
```

![](https://threejs-journey.com/assets/lessons/12/014.jpg)

```javascript
const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
const matcapTexture = textureLoader.load("/textures/matcaps/4.png");
const matcapTexture = textureLoader.load("/textures/matcaps/5.png");
const matcapTexture = textureLoader.load("/textures/matcaps/6.png");
const matcapTexture = textureLoader.load("/textures/matcaps/7.png");
const matcapTexture = textureLoader.load("/textures/matcaps/8.png");
```

![](https://threejs-journey.com/assets/lessons/12/015.jpg)

## MeshDepthMaterial

- simply colors the geometry in:
  - white if it's close to the camera's `near` value
  - black if it's close to the `far` value of the camera

```javascript
// // MeshMatcapMaterial
// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture

// MeshDepthMaterial
const material = new THREE.MeshDepthMaterial();
```

## MeshLambertMaterial

- requires **light** to be seen
- supports the same properties as the [MeshBasicMaterial](https://threejs.org/docs/index.html#api/en/materials/MeshBasicMaterial)
- most **performant** material that uses lights
  - but bruno says that there are some weird patterns idk

```javascript
const material = new THREE.MeshLambertMaterial();
```

## MeshPhongMaterial

- very similar to the [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)
- strange patterns are less visible
- can also see the light reflection on the surface of the geometry
- less performant than [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial) (but doesn't really matter at this level)
- paramters
  - `shininess` - higher values > shinier
  - `specular` - controls color of reflection

```javascript
const material = new THREE.MeshPhongMaterial();
```

![](https://threejs-journey.com/assets/lessons/12/020.jpg)

```javascript
material.shininess = 100;
material.specular = new THREE.Color(0x1188ff);
```

![](https://threejs-journey.com/assets/lessons/12/021.jpg)

## MeshToonMaterial

- similar properties as  [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial)in terms of properties
- cartoonish style
- two-part coloration by default
  - one for the shadow
  - one for the light
- can set `gradientMap` for more coloration

```javascript
const material = new THREE.MeshToonMaterial();

// Cartoon effect doesn't really work when `gradientMap` is set because the GPU blends the colors
material.gradientMap = gradientTexture;

// Enables cartoon effect
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

// Can set this to false since THREE.NearestFilter doesn't use mipmaps
gradientTexture.generateMipmaps = false;
```

## MeshStandardMaterial

- uses physically based rendering principles

- it supports lights but with a more realistic algorithm
- has more parameters e.g.
  - roughness
  - metalness
- **environment map** - image of what's surrounding the scene
  - Uses:
    - add reflection
    - refraction
    - lighting to your objects
  - also compatible with [MeshLambertMaterial](https://threejs.org/docs/#api/en/materials/MeshLambertMaterial) and [MeshPhongMaterial](https://threejs.org/docs/#api/en/materials/MeshPhongMaterial)
- Other properties

| Property                    | Description                                                                                                          |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `map`                       | for applying simple textures                                                                                         |
| `aoMap` (ambient occlusion) | adds shadows where texture is dark                                                                                   |
| `aoMapIntensity`            | controls intensity of `aoMap`                                                                                        |
| `displacementMap`           | moves the vertices to create true relief _(might need to add more vertices to the geometries for it to look better)_ |
| `displacementScale`         |                                                                                                                      |
| `metalnessMap`              |                                                                                                                      |
| `roughnessMap`              |                                                                                                                      |
| `normalMap`                 | fake the normal orientation and add details to the surface regardless of the subdivision                             |
| `normalScale`               | `Vector2` object                                                                                                     |
| `transparent`               |                                                                                                                      |
| `alphaMap`                  |                                                                                                                      |

```javascript
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";

const material = new THREE.MeshStandardMaterial();

material.metalness = 0.7;
material.roughness = 0.2;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;

// Set `metalness` and `roughness` to 1 if these are parameters are set
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;

material.normalMap = doorNormalTexture;

material.normalScale.set(0.5, 0.5);

material.transparent = true;
material.alphaMap = doorAlphaTexture;

/**
 * Environment map
 */
const rgbeLoader = new RGBELoader();
rgbeLoader.load("./textures/environmentMap/2k.hdr", (environmentMap) => {
  console.log(environmentMap);

  environmentMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.background = environmentMap;
  scene.environment = environmentMap;
});
```

## MeshPhysicalMaterial

- same as the [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
- has support of additional effects

```javascript
// Copy of MeshStandardMaterial parameters
const material = new THREE.MeshPhysicalMaterial();
material.metalness = 1;
material.roughness = 1;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;
material.displacementMap = doorHeightTexture;
material.displacementScale = 0.1;
material.metalnessMap = doorMetalnessTexture;
material.roughnessMap = doorRoughnessTexture;
material.normalMap = doorNormalTexture;
material.normalScale.set(0.5, 0.5);

// Clearcoat
material.clearcoat = 1;
material.clearcoatRoughness = 0;

// Sheen
material.sheen = 1;
material.sheenRoughness = 0.25;
material.sheenColor.set(1, 1, 1);

// Iridescence
material.iridescence = 1;
material.iridescenceIOR = 1;
material.iridescenceThicknessRange = [100, 800];

// Transmission
material.transmission = 1;
material.ior = 1.5;
material.thickness = 0.5;
```

### Clearcoat

> simulate a thin layer of varnish on top of the actual material

- This layer has its own reflective properties
- can still see the default material behind it
- [example](https://threejs.org/examples/#webgl_materials_physical_clearcoat)

### Sheen 

> highlights the material when seen from a **narrow** angle

- can usually see this effect on fluffy material like fabric (gives it a _soft_ feeling)
- [example](https://threejs.org/examples/?q=sheen#webgl_loader_gltf_sheen)

### Iridescence

> effect where color artifacts are visible

- Examples
  - fuel puddle
  - soap bubbles
  - [example](https://threejs.org/examples/?q=anis#webgl_loader_gltf_anisotropy)

Add the `iridescence`, `iridescenceIOR`, and `iridescenceThicknessRange` properties with their respective tweaks:

### Transmission

> enable light to go through the material

- more than just transparency with `opacity`
  - image behind the object gets deformed
- [example](https://threejs.org/examples/?q=physica#webgl_materials_physical_transmission_alpha)
- for translucent effect
- `ior`
  - Index Of Refraction
  - depends on the type of material you want to simulate
  - [https://en.wikipedia.org/wiki/List_of_refractive_indices](https://en.wikipedia.org/wiki/List_of_refractive_indices)
- `thickness`
  - a fixed value
  - the actual thickness of the object isn’t taken into account

```ad-warning
Worst material in terms of performance
```

## PointsMaterial

- handle particles
  - size
  - color
  - what’s drawn in them
  - etc.

## ShaderMaterial and RawShaderMaterial

```ad-note
Covered in a later chapter
```

---

# References

- ThreeJS Chapter 1 Lesson 11
