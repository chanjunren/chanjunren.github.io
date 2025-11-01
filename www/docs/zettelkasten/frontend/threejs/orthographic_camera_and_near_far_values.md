🗓️ 29052024 1334
📎 #wip #threejs

# orthographic_camera_and_near_far_values
Understanding how the `near` and `far` values relate to an orthographic camera, and how they affect different camera types, is crucial for correctly setting up shadows and rendering in 3D scenes. Here's a detailed explanation:

## Orthographic Camera

An orthographic camera in Three.js is used for rendering 3D objects without perspective distortion. This type of camera is commonly used for 2D games, CAD applications, and architectural visualizations.

### Near and Far Clipping Planes

- **Near Clipping Plane (`shadow-camera-near`)**: This is the closest distance from the camera where objects will be rendered. Objects closer than this distance will be clipped and not visible.
- **Far Clipping Plane (`shadow-camera-far`)**: This is the farthest distance from the camera where objects will be rendered. Objects further than this distance will be clipped and not visible.

In an orthographic camera, these values define the range along the camera's z-axis that will be rendered. The objects within this range are visible, and those outside are clipped.

### Orthographic Camera Properties for Shadows

- **Top, Bottom, Left, Right**: These properties define the extents of the orthographic camera's view frustum in the x and y axes. Essentially, they set the boundaries of the shadow-casting area.

### Example and Effect

In your example:

jsx

Copy code

`<directionalLight   castShadow   ref={directionalLightRef}   position={[1, 2, 3]}   intensity={4.5}   shadow-mapSize={[1024, 1024]}   shadow-camera-near={1}   shadow-camera-far={10}   shadow-camera-top={2}   shadow-camera-right={2}   shadow-camera-bottom={-2}   shadow-camera-left={-2} />`

- **shadow-camera-near={1}**: Shadows are cast from objects that are at least 1 unit away from the light source.
- **shadow-camera-far={10}**: Shadows are cast from objects up to 10 units away from the light source.
- **shadow-camera-top/right/bottom/left**: Define the orthographic bounds of the shadow casting area.

## Other Camera Types

### Perspective Camera

A perspective camera mimics the way the human eye sees, with objects appearing smaller as they get further away.

#### Near and Far Clipping Planes

- **Near Clipping Plane**: Defines the closest distance from the camera where objects will start to be rendered. Too small a value can cause depth buffer issues, also known as z-fighting.
- **Far Clipping Plane**: Defines the farthest distance from the camera where objects will be rendered.

In a perspective camera, the near and far values still define the visible range, but objects are scaled based on their distance from the camera, creating a sense of depth.

### Shadow Mapping with Perspective Camera

When using a perspective camera for shadow mapping:

- The shadow map's frustum will be a truncated pyramid (similar to the view frustum of the perspective camera).
- **shadow-camera-near** and **shadow-camera-far**: Define the depth range of the shadows.
- Orthographic bounds (`shadow-camera-top`, etc.) are not used directly because the frustum is not a box but a pyramid.

### Practical Implications

If you switch to a perspective camera:

- Shadows will be cast and received based on the perspective frustum.
- `shadow-camera-near` and `shadow-camera-far` still determine the depth range of the shadows, but you don't have explicit control over orthographic extents.

### Example with Perspective Camera

jsx

Copy code

`<directionalLight   castShadow   ref={directionalLightRef}   position={[1, 2, 3]}   intensity={4.5}   shadow-mapSize={[1024, 1024]}   shadow-camera-near={1}   shadow-camera-far={50} />`

In this setup:

- Shadows will be cast within the depth range of 1 to 50 units.
- The perspective frustum automatically adjusts the view based on the camera's field of view (FOV).

### Summary

- **Orthographic Camera**: Uses `near`, `far`, and explicit orthographic bounds to define the shadow casting area.
- **Perspective Camera**: Uses `near` and `far` to define the depth range, with the frustum automatically adjusting based on the FOV.

Understanding these concepts will help you fine-tune the rendering and shadow casting in your Three.js scenes effectively.

---

## References
	- ChatGPT