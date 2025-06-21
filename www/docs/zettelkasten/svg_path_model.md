🗓️ 21062025 1648
📎

# svg_path_model
## Path-Based Mental Model
- SVG uses a **path model**: shapes are defined by outlines (paths), then styled.
- Every shape is a path that can be:
    - **Filled** (`fill`) to color the interior
    - **Stroked** (`stroke`) to outline the shape

## Fill Attributes

| Attribute      | Description                                | Notes                       |
| -------------- | ------------------------------------------ | --------------------------- |
| `fill`         | Color used to fill the interior of a shape | Defaults to black           |
| `fill="none"`  | Makes the shape transparent                | Must be explicitly set      |
| `currentColor` | Inherits text color from parent HTML       | Only works with inline SVGs |
- Accepts all valid CSS color formats (e.g. `red`, `#ff0000`, `hsl(...)`)

## Stroke Attributes

|Attribute|Description|Notes|
|---|---|---|
|`stroke`|Color of the shape's outline|Accepts any CSS color, including `currentColor`|
|`stroke-width`|Thickness of the outline|Measured in SVG units|
|`stroke-dasharray`|Pattern of dashes for the outline|E.g. `5 3` for dashed lines|
|`stroke-dashoffset`|Offset where the dash pattern begins|Useful for animation effects|
|`stroke-linecap`|Style of line ends (`butt`, `round`, `square`)|Only for open paths or lines|
|`stroke-linejoin`|Style of corners where paths meet (`miter`, `round`, `bevel`)|Affects sharp corners|
|`stroke-miterlimit`|Limits sharpness of `miter` joins|Only applies if `stroke-linejoin=miter`|
## Drawing Order & Stacking

| Concept      | Behavior                                    |
| ------------ | ------------------------------------------- |
| DOM order    | Determines which shape appears on top       |
| `z-index`    | Ignored in SVGs                             |
| Manipulation | Move element later in code to bring forward |

---
# References
