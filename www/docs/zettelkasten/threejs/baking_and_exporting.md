🗓️ 20240430 1419
📎 #threejs

# baking_and_exporting

```ad-important
Goal is to export blender model to 3JS

Steps:
- Optimise
- Unwrap
- Bake
```

## Optimisations

### Removing hidden faces

- Basically, just remove additional faces that cannot be seen by the scene
- Consider how the camera will interact with the scene

```ad-tip
Switch between `wireframe` and `solid` to clearly see which faces are not needed
```

Though it isn't mandatory, if some rocks are overflowing into the ground, you can fix that with the `bissect` tool we used in the previous lesson. Select all the faces in `Edit Mode`, press `F3` and search for `bissect`. Then slice the overflowing parts of the rocks you want to cut out.

### Fixing faces orientation

- Faces in blender have a `front` and a `back`
- Blender faces need to all face the **correct** side (🔵)
  > Might cause baking issues otherwise
- Faces can be affected by `extrudes` / `insets` other blender operations

To fix:

1. ![[blender_face_orientation_menu.png]]
2. Fix all red faces
   ![[blender_face_orientation_initial.png]]

3. To fix:
   1. Select object
   2. `Edit Mode`
   3. Select faces
   4. `F3` > search `flip` > `Mesh > Normals > Flip`

### Normalize scales

#### Background

- Objects scaled in `Edit Mode` > geometry scaled, not object
- Objects scaled in `Object Mode` > object scaled, not geometry
- For automatic UV unwrapping, blender takes into account **geometry size**
  - This might cause the objects to take up less / more space

> Therefore, need to normalise scales

In `Object Mode`, select all the objects with `A` , press `CTRL + A` to open the `Apply` menu and choose `Scale`:

![](https://threejs-journey.com/assets/lessons/35/016.png)

You can't see a difference, but all of the object scales have been applied to their geometries instead. This way, all our objects now have a scale of `1`.

We are done with the optimization and we can start to UV unwrap our scene.

Don't forget to save.

## UV unwrapping
> Goal: unfold all the geometry composing our scene into `UV Editor`'s square

### Notes

- Exclude Emission Materials (Put them in a separate collection)

  - Make them unselectable (so that they are not included in baking)
  
![](https://threejs-journey.com/assets/lessons/35/042.png)

- Mark seams > Unwrap
- Use `Smart UV Project` for rocks
  - Increase the Islands Margin to something like `0.025` to make some space between the islands.

### Reorganising

- `UV Editor` > check `Display Stretch` and change it to `Area`:

![](https://threejs-journey.com/assets/lessons/35/062.png)

- Scale the parts until everything has a similar colour

![](https://threejs-journey.com/assets/lessons/35/064.png)
  

### Tips

1. Start by placing the groups in a rough square shape without looking at map limits 
2. Resize the whole thing to make it fit in the UV map
3. Keep some space between the islands
4. You can scale some islands up to have a better quality for them in the final texture
	- Good practice to do that for big surface or surfaces that the camera can see from up close
	- In our case, we can make the floor a little bit bigger
5. Leave some room in case you need to add some objects in future
## Baking

### Creating the texture
1. Go to `UV` Editor
2. `+ New`

```ad-note
Idk what he means but I just leave it here

This isn't that important but, in Three.js, when looking at the model from specific angles, the mip mapping might let that color appear on edges of the geometry. A white tint will look like a reflection and users won't notice it.
```
```ad-info
Intermediate file so that the final output texture JPEG can have better colours
```

3.  Save as `Radiance HDR`

### Preparing the materials
For each material, need to specify output image
1. `Shader Editor` > 
2. Check `Use Nodes`
3. `Shift + A`  > `Texture` > `Image Texture`
4. Specify image

```ad-warning
Make sure that this texture node is selected (it should have a white outline)


If you have multiple texture nodes in your shader, the active one will be the one used for baking.
```
```ad-note
Also, we leave the `Color Space` as linear

This might sound strange because we learned that sRGB enables better color management, but don't forget that this is still an HDR texture and we are not going to use it directly in the WebGL
```

![](https://threejs-journey.com/assets/lessons/35/081.png)



### Baking the floor[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#baking-the-floor)

It's finally time to do our first bake.

First of all,

While the floor is still selected, in the `Properties` area, go to the `Render Properties` tab and then in the `Bake` section:

![](https://threejs-journey.com/assets/lessons/35/082.png)

If you can't see this section, you are probably using `Eevee`. Change the `Render Engine` to `Cycles`.

The `Bake` button will start the baking process. Don’t click on it yet because we need to tweak some parameters.

The `Bake Type` menu lets us choose what we want to bake. For example, this is where we could have created an `Ambient Occlusion` texture. Leave it on `Combined` in order to bake everything.

![](https://threejs-journey.com/assets/lessons/35/083.png)

The `View From` will decide where the camera should be when rendering each surface. This can have quite a huge impact on reflection. In our case, we can’t see much reflection because of the roughness of the materials, yet, we want something as close as the render we made earlier so we are going to go for `Active Camera`.

![](https://threejs-journey.com/assets/lessons/35/084.png)

The `Margin` property lets us control how much the baking will overflow from the area it is supposed to fill. We can keep `16 px` for now. If we see that the baked islands are overlapping on their neighbors, we can reduce the margin.

Still in `Margin`, the `Type` property will decide if the margin will contain the pixels of the adjacent face or extend the existing face. Let’s use `Extend` which usually result in cleaner edges once used in WebGL.

![](https://threejs-journey.com/assets/lessons/35/085.png)

The `Clear Image` property will erase the current image in the texture each time we do a bake. Because we are not going to do all the baking at once, uncheck it.

![](https://threejs-journey.com/assets/lessons/35/086.png)

Before we can bake, we have to choose a `Sampling` quality. Scroll up to the `Sampling > Render` section.

Set the Samples to `128` which might sound low, but it’s quite a huge texture and we don’t want to wait hours for the render to finish.

Also deactivate the `Denoise` because we are going to apply it later on the final baked texture. Keeping it checked might result in visual artefacts for some Blender versions.

![](https://threejs-journey.com/assets/lessons/35/087.png)

Make sure you selected only the floor and that the Texture node is active. Now, hit the `Bake` button and wait.

![](https://threejs-journey.com/assets/lessons/35/088.png)

You can see the progress at the bottom of Blender:

![](https://threejs-journey.com/assets/lessons/35/089.png)

The floor is the biggest and longest part to render, but if you want to accelerate the process, you can change the `Sampling` to `128` and it should look good enough.

Here is your floor baked onto the texture:

![](https://threejs-journey.com/assets/lessons/35/090.png)

If the baking has ended, but you can't see the result in the texture, it might be a Blender bug. Do not worry, the process probably worked alright. Save the image with `ALT + S` while hovering the `UV Editor` area. Then, click on the refresh button you can find in the menu on the right of that same area (press `N` to toggle the menu):

![](https://threejs-journey.com/assets/lessons/35/091.png)

Even if the baking worked, now is a good time to save the image. Since the image is a separate file in Blender, you have to save the image independently. If you try to leave Blender with an unsaved image, do not worry, Blender will alert you.

To save the image, while hovering in the `UV Editor` area, press `ALT + S`.

### Baking the other objects[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#baking-the-other-objects)

We can now repeat the process for the other objects. Let's start with the fences.

Select the fences:

![](https://threejs-journey.com/assets/lessons/35/092.png)

Add the same `Image Texture` node and change it to the `baked` texture. Also make sure that the node is active:

![](https://threejs-journey.com/assets/lessons/35/093.png)

Click the `Bake` button and wait:

You can continue like this with all the objects in the scene.

If you try to bake the trunks, the axe handle or the logs, you'll see that the texture is already set in the `Shader Editor` nodes. It's because they are sharing the same material.

You can try to bake multiple objects at once, as long as the texture node is set for all concerned materials.

Here is the final baked texture:

![](https://threejs-journey.com/assets/lessons/35/094.png)

Don't forget to save both the `.blend` file and the image.

### Troubleshooting

If you see some parts overlapping, select the object, go into `Edit Mode`, select all the faces and start moving the UV mapping to separate the islands a little. Then do the baking process of those parts again.

If some islands look unusually black, you might have flipped their normals accidentally. You need to locate them and flip them back.

- Display the normal orientation like we did previously.
- Locate the problematic ones (they should be red).
- Select the object and go into `Edit Mode`.
- Select the red faces.
- Press `F3`, search for `flip` and choose `Mesh > Normals > Flip`.

You can bake them on top of the previous bake.

## Exporting the image [01:54:22](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#)[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#exporting-the-image)

### The color issue[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#the-color-issue)

As you can see, the colors are all burned out. If you compare to the render, the colors will have less contrast and look like this:

![](https://threejs-journey.com/assets/lessons/35/095.png)

It's as if they are being toned in the render and that's exactly the case. When you do a render in Blender, a color manager named **Filmic** is used.

You can find it at the bottom of the `Render Properties` tab in the `Color Management` section:

![](https://threejs-journey.com/assets/lessons/35/096.png)

If you want to test a render without Filmic, change the `View Transform` to `Standard` and do a render with `F12`:

![](https://threejs-journey.com/assets/lessons/35/097.png)

As you can see, we have the same ugly colors with high contrast.

This tells us that, when baking in Blender, we are losing Filmic.

### The noise issue

Another problem is the visual noise. When you do a render and if you have checked the `denoise` parameter, you can see a smooth render without noise.

When baking, the noise is back:

![](https://threejs-journey.com/assets/lessons/35/098.png)

As with Filmic, Blender seems to ignore the denoise parameter.

### The image type issue[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#the-image-type-issue)

Finally, we want to export a compressed image that we can use in Three.js. We want it to be light and because we don't need transparency, we can use JPEG. Also, we want to apply the sRGB encoding to improve the color quality.

But currently, all we have is our fancy HDR image.

### The solution[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#the-solution)

All of these problems can be fixed with the Blender **Compositor**.

The Compositor can be accessed within an area. Change one of the current areas (or create a new one) and choose `Compositor`:

![](https://threejs-journey.com/assets/lessons/35/099.png)

The compositor uses nodes and, by default, your should have a `Render Layers` node and a `Composite` node:

![](https://threejs-journey.com/assets/lessons/35/100.png)

To tell Blender to use those nodes when rendering, make sure to check the `Use Nodes` on top of the `Compositor` area:

![](https://threejs-journey.com/assets/lessons/35/101.png)

The idea, here, is to create some nodes that will take our texture, apply a denoise on it and then apply Filmic. Then we output that texture to the render by sending it to the `Composite` node.

Start by creating an `Image` node with `SHIFT + A`:

![](https://threejs-journey.com/assets/lessons/35/102.png)

Change the image to our `baked`, using the dropdown menu:

![](https://threejs-journey.com/assets/lessons/35/103.png)

Normally, you should see your texture in the node preview, but this feature sometimes has bugs. Save everything and reopen it if you want to see the preview:

![](https://threejs-journey.com/assets/lessons/35/104.png)

Now create a `Denoise` node to the right of the `Image` node:

![](https://threejs-journey.com/assets/lessons/35/105.png)

Keep the default parameters:

![](https://threejs-journey.com/assets/lessons/35/106.png)

Link the `Image` output of the `Image` node to the `Image` input of the `Denoise` node:

![](https://threejs-journey.com/assets/lessons/35/107.png)

Link this `Denoise` output to the `Composite` input:

![](https://threejs-journey.com/assets/lessons/35/108.png)

But where is Filmic? you might ask.

Filmic will automatically be applied as long as you have set it in the parameters of the render:

![](https://threejs-journey.com/assets/lessons/35/109.png)

Doing the compositing is like doing a render. But we don't want to render the scene, we want to render our image through the nodes we created. To deactivate the default render of the scene, select the `Render Layers` and press `M` to "mute" it.

It should appear gray:

![](https://threejs-journey.com/assets/lessons/35/110.png)

If you want to do a classic render again, you'll have to mute the two nodes we've made, unmute the `Render Layers` and link this last one to the Composite.

We also need to change the resolution of the render so it matches the texture resolution.

Go into the `Output Properties` and change the resolution to `4096x4096`:

![](https://threejs-journey.com/assets/lessons/35/111.png)

Finally, render with `F12`.

This operation shouldn't take too long and you should see a beautiful render with the right colors and no noise on it:

![](https://threejs-journey.com/assets/lessons/35/112.jpg)

With the render window open and while hovering it, press `ALT + S` to save it.

Change the `File Format` to `JPEG`, lower the quality a little (`75%` should be enough) and name it `baked.jpg`:

![](https://threejs-journey.com/assets/lessons/35/113.png)

Save it where you want. We are going to use it later in Three.js.

## Exporting the model [02:08:04](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#)[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#exporting-the-model)

We need to apply some modifications to the model in order to optimize it a bit more. But we are not going to do that now because we want to witness the issues when importing it into Three.js. This will help us understand better why we are doing these optimizations.

For now, let's simply export the whole scene.

Make all the collections selectable but not the `others` collection (even the `emissions` collection):

![](https://threejs-journey.com/assets/lessons/35/114.png)

In `Object Mode`, select everything with `A`:

![](https://threejs-journey.com/assets/lessons/35/115.png)

Now export as `glTF 2.0`:

![](https://threejs-journey.com/assets/lessons/35/116.png)

Here are the exporting parameters:

![](https://threejs-journey.com/assets/lessons/35/117.png)

Some more information:

- Check `Remember Export Settings`, so you don't have to set those settings every time you want to export.
- Use `.glb` because it's lighter, though it won't make a huge difference.
- Export only the `Selected Objects`. We don't want to export the camera and the light.
- Check `+Y Up` because the `Y` axis is going up on Three.js.
- In the geometry, we only need the `UVs`. Remember that we just want to place the baked texture on it.
- Activate the `Compression`. We are going to use Draco.
- Deactivate everything related to the `Animation` because we have none.

Name your file `portal.glb` and put it with your `baked.jpg` file.

We now have both the `baked.jpg` file and the `portal.glb` files. In the next lesson, we are going to import them into Three.js as well as optimize the model a bit more.

---

# References
