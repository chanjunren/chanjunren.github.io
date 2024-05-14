---
sidebar_position: 1
sidebar_label: Summary
---

# Summary

## Transformation
- **Usage**: To manipulate the position, rotation, and scale of objects in 3D space.
- **Commands**:
  - **Position**: `object.position.set(x, y, z)`
  - **Rotation**: `object.rotation.set(x, y, z)`
  - **Scale**: `object.scale.set(x, y, z)`
- **Note**: Transformations are cumulative and order-dependent (rotation can be affected by position, etc.).

## Animations
- **Usage**: To add movement to objects, characters, etc.
- **Setup**:
  - **Animation Mixer**: `const mixer = new THREE.AnimationMixer(object)`
  - **Load Animation**: Use `GLTFLoader` to load animations.
  - **Play Animation**: `mixer.clipAction(gltf.animations[0]).play()`
  - **Update**: Inside the render loop: `mixer.update(deltaTime)`
- **Note**: Animations need to be updated in the rendering loop.

## Cameras
- **Usage**: To control the viewer's perspective in the 3D world.
- **Types**:
  - **Perspective Camera**: Mimics human eye, `new THREE.PerspectiveCamera(fov, aspect, near, far)`
  - **Orthographic Camera**: No perspective distortion, `new THREE.OrthographicCamera(left, right, top, bottom, near, far)`
- **Note**: Choose based on the type of projection needed (realistic or orthographic).

## Geometries
- **Usage**: Defines the shape of 3D objects.
- **Types**:
  - **Box**: `new THREE.BoxGeometry(width, height, depth)`
  - **Sphere**: `new THREE.SphereGeometry(radius, widthSegments, heightSegments)`
  - **Custom**: Use `THREE.BufferGeometry()` for custom shapes.
- **Note**: Geometries are the backbone of any 3D object, defining its structure.

## Textures
- **Usage**: To add surface detail like color, bumpiness, or shininess to geometries.
- **Setup**:
  - **Load Texture**: `const texture = new THREE.TextureLoader().load('path/to/texture.jpg')`
  - **Repeat**: `texture.wrapS = texture.wrapT = THREE.RepeatWrapping`
- **Note**: Textures greatly enhance the visual realism of objects.

## Materials
- **Usage**: To define how the surface of geometries interacts with light.
- **Types**:
  - **Basic**: No light interaction, `new THREE.MeshBasicMaterial({ color })`
  - **Standard**: Reacts to lighting, `new THREE.MeshStandardMaterial({ color })`
  - **Physical**: Advanced light interaction, `new THREE.MeshPhysicalMaterial({ color })`
- **Note**: Material choice affects the appearance and realism of objects under different lighting conditions.

## Lights
- **Usage**: To illuminate scenes and create shadows.
- **Types**:
  - **Ambient Light**: Uniform light, `new THREE.AmbientLight(color, intensity)`
  - **Point Light**: Light emitted from a point, `new THREE.PointLight(color, intensity, distance)`
  - **Directional Light**: Sun-like light, `new THREE.DirectionalLight(color, intensity)`
- **Note**: Proper lighting is crucial for setting the mood and enhancing realism.

## Shadows
- **Usage**: To add realistic shadows cast by objects.
- **Setup**:
  - **Enable Shadows**: `renderer.shadowMap.enabled = true`
  - **Cast Shadows**: `object.castShadow = true`
  - **Receive Shadows**: `object.receiveShadow = true`
- **Note**: Shadows increase realism but can be computationally expensive.

## Physics (CANNON)
- **Usage**: To simulate realistic physics like gravity, collisions.
- **Setup**:
  - **Create Physics World**: `const world = new CANNON.World()`
  - **Add Bodies**: `world.addBody(new CANNON.Body({ mass, shape }))`
  - **Update Physics**: In the animation loop: `world.step(timeStep)`
- **Note**: Physics simulations need continuous updates in the animation loop.

## Renderers
- **Concept**: Renders the visual output of the scene using WebGL.
- **Use Case**: Displaying 3D graphics on a web page.
- **Basic Syntax**: `const renderer = new THREE.WebGLRenderer(); renderer.setSize(window.innerWidth, window.innerHeight); document.body.appendChild(renderer.domElement);`

## Scene Graph
- **Concept**: A hierarchical model representing all objects in a 3D scene.
- **Use Case**: Organizing and managing complex scenes with many objects.
- **Basic Syntax**: `const scene = new THREE.Scene(); scene.add(object);`

## Loading External Models
- **Concept**: Importing pre-made 3D models into Three.js scenes.
- **Use Case**: Incorporating complex or detailed models created in 3D modeling software.
- **Basic Syntax**: 
  - **GLTF Loader**: `const loader = new THREE.GLTFLoader(); loader.load('model.gltf', (gltf) => { scene.add(gltf.scene); });`

## Event Handling
- **Concept**: Detecting and responding to user interactions like mouse clicks and keyboard input.
- **Use Case**: Creating interactive 3D applications.
- **Basic Syntax**: `window.addEventListener('click', (event) => { /* handle click */ });`

## Grouping Objects
- **Concept**: Combining multiple objects into a single group.
- **Use Case**: Managing related objects as a single entity, which simplifies transformations and animations.
- **Basic Syntax**: `const group = new THREE.Group(); group.add(object1); group.add(object2); scene.add(group);`

## Raycasting
- **Concept**: Projecting a ray from a point to detect intersects with objects.
- **Use Case**: Implementing features like object selection, mouse hover effects, or collision detection.
- **Basic Syntax**: `const raycaster = new THREE.Raycaster(); raycaster.setFromCamera(mouse, camera); const intersects = raycaster.intersectObjects(scene.children);`

## Custom Shaders and Materials
- **Concept**: Writing custom GLSL shaders for advanced visual effects.
- **Use Case**: Creating unique and complex visual effects that are not possible with standard materials.
- **Basic Syntax**: `const material = new THREE.ShaderMaterial({ vertexShader: myVertexShader, fragmentShader: myFragmentShader });`

## Post-Processing
- **Concept**: Applying effects to the rendered image after the scene is rendered.
- **Use Case**: Enhancing the visual quality with effects like bloom, depth of field, or color correction.
- **Basic Syntax**: `const composer = new THREE.EffectComposer(renderer); const renderPass = new THREE.RenderPass(scene, camera); composer.addPass(renderPass);`

## Responsive Design
- **Concept**: Adapting the rendering to different screen sizes and aspect ratios.
- **Use Case**: Ensuring the 3D content looks good on all devices and window sizes.
- **Basic Syntax**: `window.addEventListener('resize', () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); });`

## Performance Optimization
- **Concept**: Enhancing the efficiency of the application for smoother performance.
- **Use Case**: Ensuring your 3D application runs smoothly, especially important for complex scenes or lower-end devices.
- **Basic Syntax**: Techniques like geometry merging, texture optimization, and minimizing dynamic shadows can be employed for optimization.
