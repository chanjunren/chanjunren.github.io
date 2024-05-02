🗓️ 20240430 1419

📎

# baking_and_exporting

```ad-important
Goal is to export blender model to 3JS

Need to:
- Optimise
- Unwrap
- Bake
```

## Shortcuts dump

| Shortcut | Description      | Notes                      |
| -------- | ---------------- | -------------------------- |
| `u`      | open unwrap menu | select object in edit mode |
|          |                  |                            |

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
   4. `F3` > search `flip` > `Mesh > Normals > Flio`

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

- The idea is to unfold all the geometry composing our scene into a square

The `UV Editor` displays a square that represents our unfold. We need to make everything fit inside that square. We could have used multiple textures, which would mean independent UV unwraps, but our scene isn't that complex or big.

When you choose `Unwrap`, a small menu appears on the bottom left of the area (if you lost that menu, unwrap again):

![](https://threejs-journey.com/assets/lessons/35/037.png)

You should change the `Margin` to something like `0.065`:

![](https://threejs-journey.com/assets/lessons/35/039.png)

(You might have noticed that there are more islands in the above screenshot. This is due to an error in which I duplicated one of the fences at the same place. Ignore this.)

Put those unwraps in a corner of the UV map:

![](https://threejs-journey.com/assets/lessons/35/040.png)

Again, the exact position isn't important and we will reorganize everything later.

### Separating the Emission material[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#separating-the-emission-material)

We are going to repeat the whole process for the pole lights, but before doing so, we need to separate the objects that emit lights.

We are doing this because we don't want to bake those objects. In the end, they are uniform colors and we are going to create materials within Three.js to give them those colors.

We could have baked those objects, but it's a waste of space in the texture.

Create a `emissions` collection and put the two lamps and the portal (only the emission part) in it:

![](https://threejs-journey.com/assets/lessons/35/041.png)

Make this collection unselectable so that we don't select them while doing the baking:

![](https://threejs-journey.com/assets/lessons/35/042.png)

### Pole lights[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#pole-lights-1)

We can now unwrap the pole lights.

As with the fences, start with only one and, once you are happy, duplicate it and put it in place of the other pole light.

To help you focus on the object you want to unwrap, you can select it and press `/` on the numpad. This will isolate it:

![](https://threejs-journey.com/assets/lessons/35/043.png)

If you want to leave that isolation, press `/` again.

You can try the unwrap on your own. Take your time, it's a long process. But with time, you'll be able to do it fast and efficiently.

You'll probably get a different result than in the lesson and that's totally normal. There are so many different ways of unwrapping and we don't really know if we are doing mistakes yet. Just do your best and don't hesitate to create too many cuts.

Here is how I did it:

![](https://threejs-journey.com/assets/lessons/35/044.png)

The lamp frame is especially hard to cut. Here, I decided to make only one cut that goes from the bottom up. This is not always a good idea because, as you can see, it creates some distortion once you unwrap it:

![](https://threejs-journey.com/assets/lessons/35/045.png)

But it's not that bad and at least we minimize the number of islands.

The unwrap looks like this:

![](https://threejs-journey.com/assets/lessons/35/046.png)

Before reorganizing the islands, we can duplicate the pole in place of the other one and unwrap both of them together:

![](https://threejs-journey.com/assets/lessons/35/047.png)

Since the islands are curvy, Blender doesn't do a great job placing them. Optimize the placement a little bit and put them in another corner of the UV map. Always make sure to leave some space between them:

![](https://threejs-journey.com/assets/lessons/35/048.png)

### Portal[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#portal-1)

Apply the same process for the portal. Isolate each object, add the seams, test the result by unwrapping and once you're done with all the parts of the portal, select them all and unwrap everything.

Here is the stair:

![](https://threejs-journey.com/assets/lessons/35/049.png)

Here are the bricks:

![](https://threejs-journey.com/assets/lessons/35/050.png)

And here is the whole portal:

![](https://threejs-journey.com/assets/lessons/35/051.png)

### Rocks[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#rocks-1)

Do not worry, we are **not** going to cut them ourselves. Even if we did, it would have taken ages and we would have ended up with distorted unwraps. Instead, we are going to use an automatic "smart" unwrap.

- Select all the rocks.
- Go into `Edit Mode`.
- Select all the faces.
- Press `U` and choose `Smart UV Project`.

![](https://threejs-journey.com/assets/lessons/35/052.png)

Validate the window that should open (we get access to the same parameters right after):

![](https://threejs-journey.com/assets/lessons/35/053.png)

And here is your automatic unwrap:

![](https://threejs-journey.com/assets/lessons/35/054.png)

Increase the Islands Margin to something like `0.025` to make some space between the islands.

Unfortunately, we already used all the corners of our map. For now, let's move the unwraps out of the map. This isn't a problem because, in the end, we will reorganize everything.

![](https://threejs-journey.com/assets/lessons/35/055.png)

As you can see, automatic unwraps are decent. We could have used this technique for the whole scene. But, doing it on our own let us optimize things a bit more by minimizing the number of islands and reducing the seams. It's also a good way to keep the different groups of islands separated. This might get handy if we decide to remove an object. We will get the full area available for more unwrapping.

### Trunks, logs and axe[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#trunks-logs-and-axe)

Cut the trunks. Don't forget to also add a cut for the ring all around each trunk.

![](https://threejs-journey.com/assets/lessons/35/056.png)

Cut the logs:

![](https://threejs-journey.com/assets/lessons/35/057.png)

Cut the axe:

![](https://threejs-journey.com/assets/lessons/35/058.png)

Unwrap them all (trunks, logs and axe) at once and place them somewhere outside of the UV map:

![](https://threejs-journey.com/assets/lessons/35/059.png)

### Reorganizing[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#reorganizing)

That's it, we've unwrapped the whole scene.

Currently, however, the groups of islands are spread all around the UV map and even outside of it.

Select all the unwrap objects (not the emissions objects). Then, go into `Edit Mode` and select all the faces to get a preview of the current UV unwrap:

![](https://threejs-journey.com/assets/lessons/35/060.png)

If you don't have this or if you have overlapping unwraps, try to figure out which object is the problem and fix it. You might also have forgotten some objects.

Before trying to make everything fit inside the UV map, we need to make sure that the proportions are the same between the different groups. We don't want an object to take a smaller or bigger space than it really needs.

Use the following icon on the top right part of the `UV Editor` (if you can't see it, enlarge the area):

![](https://threejs-journey.com/assets/lessons/35/061.png)

In the menu that should open, check `Display Stretch` and change it to `Area`:

![](https://threejs-journey.com/assets/lessons/35/062.png)

For some older versions of Blender, this option might be located in a different place. If you have a `Display` button on the top right corner, open it and you should find a `stretch` or `stretching` checkbox. If you don't have any of those, open the sidebar with `N` (if not already open) and go to the `view` tab to find the checkbox.

You'll now know if the area taken by an island is bigger or smaller than the others by using the colors:

![](https://threejs-journey.com/assets/lessons/35/063.png)

Scale the different parts until everything has a similar color. The color might be different from mine.

![](https://threejs-journey.com/assets/lessons/35/064.png)

It's now time to make everything fit in the UV map. One very important step here is to listen to the Tetris music theme at the same time.

![](https://threejs-journey.com/assets/lessons/35/065.png)

Few tips:

- Start by placing the groups in a rough square shape without looking at the UV map limits. Then resize the whole thing to make it fit in the UV map.
- Keep some space between the islands.
- You can scale some islands up to have a better quality for them in the final texture. It's good practice to do that for big surface or surfaces that the camera can see from up close. In our case, we can make the floor a little bit bigger.
- If you have some room left, keep it. It might become useful if you forgot an object or if you want to add one.
- The groups don't have to fit in perfect rectangles. Usually, I use one group with a lot of small islands like the rocks to fill the holes.

Once you're happy with the result, you can deactivate the `Display Stretch`:

![](https://threejs-journey.com/assets/lessons/35/066.png)

## Baking

### Creating the texture

1. Go to `UV` Editor
2. `+ New`

```ad-note
This isn't that important but, in Three.js, when looking at the model from specific angles, the mip mapping might let that color appear on edges of the geometry. A white tint will look like a reflection and users won't notice it.
```

3.  ![[blender_baking_image_settings.png]]
4.  Save as `Radiance HDR`

### Saving the texture

A saving window should open. Choose `Radiance HDR` as the `File Format` and change the name to `baked.hdr`. Make sure to save in the same folder as your `.blend` file:

![](https://threejs-journey.com/assets/lessons/35/072.png)

We chose `Radiance HDR` as the `File Format` but some other formats can support high precision textures like `OpenEXR` However, the file is going to be huge.

If you open the right menu of the `UV Editor` (press `N` while hovering the area) in the `Image` tab, you should see that the texture is now the `baked.hdr` file in the same folder:

![](https://threejs-journey.com/assets/lessons/35/073.png)

If you want to share your `.blend` file or move it in another folder, you'll have to keep the `baked.hdr` file with it.

### Preparing the materials[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#preparing-the-materials)

We are almost ready to bake. Because we can have multiple textures in our project, we need a way to tell Blender that the texture we created is the one in which each object has to be baked. This information has to be provided on each material.

We can start with the floor.

Select the floor.

To define in which texture the material should be baked, we need to use the `Shader Editor` . Take one of the areas (or create a new one) on your layout and change it to `Shader Editor`:

![](https://threejs-journey.com/assets/lessons/35/074.png)

This will be a `Shader Editor` for the `grass` material and it uses nodes. We won't go into details about nodes because we only need to create one and then make it active.

![](https://threejs-journey.com/assets/lessons/35/075.png)

If you can't see these two nodes, make sure `Use Nodes` on the top part of the area is checked:

![](https://threejs-journey.com/assets/lessons/35/076.png)

Also make sure that you selected the floor and that the `grass` material is applied to it.

To create a new node, press `SHIFT + A` while hovering the `Shader Editor` area:

![](https://threejs-journey.com/assets/lessons/35/077.png)

Here, you can navigate to `Texture > Image Texture`

![](https://threejs-journey.com/assets/lessons/35/078.png)

This is an `Image Texture` node:

![](https://threejs-journey.com/assets/lessons/35/079.png)

Click on the drop-down image icon and choose our `baked` texture:

![](https://threejs-journey.com/assets/lessons/35/080.png)

And that's it. Our material now knows it's supposed to bake itself inside the `baked` texture. We don't need to link that node to another node. We just need it to be here.

Make sure that this texture node is selected (it should have a white outline).

If you have multiple texture nodes in your shader, the active one will be the one used for baking.

![](https://threejs-journey.com/assets/lessons/35/081.png)

Also, we leave the `Color Space` as linear. This might sound strange because we learned that sRGB enables better color management, but don't forget that this is still an HDR texture and we are not going to use it directly in the WebGL.

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

### Troubleshooting[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#troubleshooting)

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

### The noise issue[](https://threejs-journey.com/lessons/baking-and-exporting-the-scene#the-noise-issue)

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
