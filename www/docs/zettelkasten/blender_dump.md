 🗓️ 21042024 1827
📎  

# blender_dump

![[blender_transform_pivot_pt_menu.png]]
- Inset
![[blender_inset_lampy.png]]
## Shader editor nodes
### Texture Coordinate
- Provides access to various types of texture coordinates for mapping textures onto 3D models
- Types: Generated, Normal, UV, Object, Camera, Window, Reflection.

**Use Case** : Adjust how textures are applied to models by specifying the coordinate system

### Mapping
Purpose: Transforms texture coordinates.

Operations: Translate, Rotate, Scale.
Use Case: Alter the position, rotation, and scale of textures on the surface of 3D models.
Gradient Texture
Purpose: Generates a gradient pattern.

Types: Linear, Quadratic, Easing, Diagonal, Radial, Quadratic Sphere, Spherical.
Use Case: Create smooth transitions between colors, often used for backgrounds, procedural textures, or special effects.
ColorRamp
Purpose: Maps input values to a gradient of colors.

Configuration: Add, remove, and adjust color stops to create custom gradients.
Use Case: Remap grayscale textures to a range of colors, control transitions between colors in procedural textures.
Principled BSDF
Purpose: A comprehensive shader for creating a wide variety of materials.

Features: Combines multiple shader types (Diffuse, Glossy, Subsurface Scattering, etc.) into a single node.
Use Case: Simplify the process of creating realistic materials by adjusting parameters like base color, roughness, metallic, etc.
Material Output
Purpose: The final node that connects the shader network to the material.

Outputs: Surface, Volume, Displacement.
Use Case: Determines how the shader is rendered on the object, and must be connected to a shader to be effective.
Example Use Cases in a Shader Network
Texture Coordinate + Mapping: Use texture coordinates to place a texture and mapping to adjust its placement on a model.
Gradient Texture + ColorRamp: Create a custom gradient effect by feeding a gradient texture into a color ramp for more control over colors.
Principled BSDF + Material Output: Create a realistic material using the Principled BSDF node and connect it to the Material Output to apply it to a 3D object.

--- 
# References
