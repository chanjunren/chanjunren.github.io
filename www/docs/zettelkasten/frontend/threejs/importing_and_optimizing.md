## Introduction [00:00](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#introduction)

In the previous lessons, we created and exported our scene.

We can now import it into Three.js, but we will also make sure to optimize our model as best as we possibly can.

## Setup [00:12](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#setup)

Currently, all we have in our scene is a white cube.

The loaders have already been added to the code, and Draco is already supported:

```javascript
/**
 * Loaders
 */
// Texture loader
const textureLoader = new THREE.TextureLoader()

// Draco loader
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('draco/')

// GLTF loader
const gltfLoader = new GLTFLoader()
gltfLoader.setDRACOLoader(dracoLoader)
```

The `portal.glb` and `baked.jpg` files are located in the `/static/` folder but you can replace them with your own files.

An instance of lil-gui is also available, and we are going to add some tweaks to it in the next lesson.

The antialias is already set on the `WebGLRenderer`.

## Loading the model [01:46](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#loading-the-model)

We can start by loading the model. We are going to keep the cube in the scene to make sure that everything is working. Once we can see our portal scene, we will get rid of the cube.

Load the model after the loaders part and test the result in the console:

```javascript
/**
 * Model
 */
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        console.log(gltf.scene)
    }
)
```

If you don't get the scene in the console log, check the path and search for errors.

We will now try to add the model to the scene:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)
    }
)
```

![](https://threejs-journey.com/assets/lessons/36/000.png)

You should see some silhouettes.

The problem is that, by default, when GLTF exports PBR materials, they get interpreted as [MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial). And, this material needs light.

But we don't want lights because our scene is baked, and all the lighting and shadow information is already contained in the texture:

![](https://threejs-journey.com/assets/lessons/36/001.jpg)

So, we are going to create a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) and apply it to all the elements in the scene.

Since we are going to create multiple materials, we need to create a section for them in the code before loading the model:

```javascript
/**
 * Materials
 */
// Baked material
const bakedMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
```

There are a lot of objects in the scene. Instead of applying the material to each one manually, we can traverse the scene in the load callback:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)
    }
)
```

![](https://threejs-journey.com/assets/lessons/36/002.png)

You should get all the objects visible with a uniform red color.

Now, remove the code related to the white cube.

![](https://threejs-journey.com/assets/lessons/36/003.png)

## Loading the texture [08:47](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#loading-the-texture)

To load the texture, we can use the `textureLoader` already in the code.

Load it before the materials:

```javascript
/**
 * Textures
 */
const bakedTexture = textureLoader.load('baked.jpg')
```

Make sure you don't get any error in the logs.

To apply this texture to our scene, we can add it to the `bakedMaterial` with the `map` property:

```javascript
const bakedMaterial = new THREE.MeshBasicMaterial({ map: bakedTexture })
```

![](https://threejs-journey.com/assets/lessons/36/004.png)

While this looks interesting and funny, this is not what we want.

The problem is that our texture `Y` coordinates are inverted. It's as if our texture has been mirrored vertically.

There is a disagreement between software / library about the direction of the `Y` axis in the texture's coordinates. We were unlucky in the illustration above, but all we need to do is flip the texture.

To do that, set the `flipY` property of `bakedTexture` to `false`:

```javascript
bakedTexture.flipY = false
```

![](https://threejs-journey.com/assets/lessons/36/005.png)

The scene looks better now.

We still need to take care of the pole lights and the portal. And the colors look washed out compared to the Blender render.

## Fixing the colors [12:39](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#fixing-the-colors)

Our baked texture is encoded with `sRGB` but Three.js isn't aware of that.

To set the encoding of the texture, change its `colorSpace` property to `THREE.SRGBColorSpace`:

```javascript
bakedTexture.colorSpace = THREE.SRGBColorSpace
```

![](https://threejs-journey.com/assets/lessons/36/006.png)

The colors are now exactly the same as in the Blender render.

## Fixing the emission objects [14:29](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#fixing-the-emission-objects)

It's time to fix the pole lights and the portal.

Because they are emission materials, they should look like uniform bright colors which is why we can use [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial).

Create a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) for the pole light:

```javascript
// Pole light material
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 })
```

Now the question is, how can we apply that material to the right objects in the scene.

If you log the `children` of the scene in the load callback, you'll see that there are 56 `Meshes` in it (this number might vary depending on your model):

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        console.log(gltf.scene.children)
        
        // ...
    }
)
```

To solve how to apply the right material to the right object, we are going to edit the model and set a specific name for each emission object.

Open the model in Blender (use your `.blend` file or use the file located in the `/resources/` folder):

![](https://threejs-journey.com/assets/lessons/36/007.png)

Enable selection on the `emissions` collection (if that's not already the case):

![](https://threejs-journey.com/assets/lessons/36/008.png)

Rename each one of the objects accordingly:

- `poleLightA`
- `poleLightB`
- `portalLight`

![](https://threejs-journey.com/assets/lessons/36/009.png)

In Blender, you can't use the same name for multiple objects because they each have a unique ID.

Select everything (except the camera and the light) and export it as `glTF 2.0`:

![](https://threejs-journey.com/assets/lessons/36/010.png)

Use the same parameters as in the previous lesson and replace the `portal.glb` file in the `/static/` folder:

![](https://threejs-journey.com/assets/lessons/36/011.png)

Spoiler alert, don't close Blender!

You can access object names in Three.js with the `name` property:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        console.log(gltf.scene.children[0].name)

        // ...
    }
)
```

What we can do now, is search in the `gltf.scene.children` array by using the name property.

In JavaScript, you can "search" in an array with the `find(...)` method:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)

        // Get each object
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        console.log(portalLightMesh)
        console.log(poleLightAMesh)
        console.log(poleLightBMesh)
    }
)
```

You should see each one of the 3 objects in the console.

If you get an error or `undefined`, check the names in your JavaScript as well as in your Blender scene. Also, make sure you exported the model the right way.

We can now replace the pole lights with the material we created earlier:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)

        // Get each object
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // Apply materials
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
    }
)
```

![](https://threejs-journey.com/assets/lessons/36/012.png)

You should see your [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) applied on both lamps.

Create a [MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial) for the portal and apply it the same way:

```javascript
// Portal light material
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })

// ...

gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        gltf.scene.traverse((child) =>
        {
            child.material = bakedMaterial
        })
        scene.add(gltf.scene)

        // Get each object
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // Apply materials
        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
    }
)
```

![](https://threejs-journey.com/assets/lessons/36/013.png)

If you have a portal color different than white, don't spend too much time trying to find the right value because we are going to replace it with a [ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial) later.

## Improving performances [29:48](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#)[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#improving-performances)

We could stop here, but we have made some performance mistakes.

First, we can test the draw calls with Spector.js.

### Monitoring[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#monitoring)

If you remember from the performance lesson, [Spector.js](https://github.com/BabylonJS/Spector.js/) is a Chrome plugin that let us see the different steps the GPU had to go through to create the render.

While this lesson is being written, the Chrome plugin isn't available anymore.

You don't need to install the plugin to follow the steps below, but it's always good to keep an eye on how your scene is being rendered in order to optimize it.

If you installed [Spector.js](https://github.com/BabylonJS/Spector.js/) in Chrome, hit the extension icon to activate it and hit it a second time to open the following menu:

![](https://threejs-journey.com/assets/lessons/36/014.png)

Click the red circle to start processing the render. This might take few seconds.

Once processed, a window should open with all the details we need. On the left, you can scroll through the different steps taken to render the scene. The less you have, the better:

![](https://threejs-journey.com/assets/lessons/36/015.png)

The performance is probably good enough, but if you think about it, we should only have 4 objects:

- The first pole light
- The second pole light
- The portal light
- All the baked objects

We don't need to separate the baked objects because we are pretty sure we are not going to move them. For example, if we moved the axe, we would still see its shadow on the trunk. If we moved a fence, we would still see its shadow on the floor.

To improve the performance, we are going to merge these geometries.

### Merging the baked objects[](https://threejs-journey.com/lessons/importing-and-optimizing-the-scene#merging-the-baked-objects)

Go back to Blender:

![](https://threejs-journey.com/assets/lessons/36/016.png)

We don't want to affect the emissions objects. Make sure to set the `emissions` collection as un-selectable:

![](https://threejs-journey.com/assets/lessons/36/017.png)

Merging all the geometries right now would be a bad idea because we might not be able to modify our scene after that. We are going to duplicate them first and put everything in a different collection before merging.

Create an empty `merged` collection:

![](https://threejs-journey.com/assets/lessons/36/018.png)

Select all the objects in the scene (not the camera, the light and the emission objects) and duplicate them with `SHIFT + D`. Validate the duplicate by clicking once on the scene (without moving the mouse).

While those duplicates objects are still selected, move them to the `merged` collection by pressing `M`:

![](https://threejs-journey.com/assets/lessons/36/019.png)

All the objects are now duplicated in the `merged` collection. You can merge them by pressing `CTRL + J` on Windows or `CMD + J` on MacOS.

Deactivate all the other collections and check that you have only one merged object:

![](https://threejs-journey.com/assets/lessons/36/020.png)

Change the name of this single object to `baked`:

![](https://threejs-journey.com/assets/lessons/36/021.png)

Reactivate the `emissions` collection in order to be able to select the objects inside.

You should keep the initial collections that you made, even if they are deactivated. They will be there in case we need to make changes or to re-bake the scene:

![](https://threejs-journey.com/assets/lessons/36/022.png)

If you switch to `Renderer` shading, you'll see that the materials are still working on the merged object.

This is because Blender can handle multiple materials on one geometry. It's not a problem because, when exporting, we ask Blender not to export the material. But if you are curious to see what your scene looks like without materials, go to the `Materials Properties` tab while selecting the `baked` object and delete all the materials by clicking on the `-` icon:

![](https://threejs-journey.com/assets/lessons/36/023.png)

This should result in a nice looking white scene.

![](https://threejs-journey.com/assets/lessons/36/024.png)

We can now export the merged object and the emissions with the same parameters as before:

![](https://threejs-journey.com/assets/lessons/36/025.png)

You should get the exact same result in Three.js:

![](https://threejs-journey.com/assets/lessons/36/026.png)

But let's look at Spector.js:

![](https://threejs-journey.com/assets/lessons/36/027.png)

As you can see, our scene is being drawn in only 4 steps. One for the baked object and one for each emission light.

We could have merged the two pole lights, but that's more than enough for now.

Now that we have only one object on which we want to apply the baked texture, we don't need to traverse all the children of the loaded scene.

We can search for it using the same method as for the emission objects:

```javascript
gltfLoader.load(
    'portal.glb',
    (gltf) =>
    {
        scene.add(gltf.scene)

        // Get each object
        const bakedMesh = gltf.scene.children.find((child) => child.name === 'baked')
        const portalLightMesh = gltf.scene.children.find((child) => child.name === 'portalLight')
        const poleLightAMesh = gltf.scene.children.find((child) => child.name === 'poleLightA')
        const poleLightBMesh = gltf.scene.children.find((child) => child.name === 'poleLightB')

        // Apply materials
        bakedMesh.material = bakedMaterial
        portalLightMesh.material = portalLightMaterial
        poleLightAMesh.material = poleLightMaterial
        poleLightBMesh.material = poleLightMaterial
    }
)
```

![](https://threejs-journey.com/assets/lessons/36/028.png)

You should get the same result. If not, make sure you changed the name of the merged object to `baked` and that you exported it with the 3 emissions objects.

In the next lesson, we are going to add some details to the scene.