🗓️ 21062025 1647

# svg_shapes

- SVGs are made of primitive shapes, each defined by a tag and a set of attributes.
- Shapes are absolutely positioned by default.
- There are **seven primitive shapes** in SVG.

## Primitive Shapes

### 1. `rect` – Rectangle

|Attribute|Description|
|---|---|
|`x`|X position of top-left corner|
|`y`|Y position of top-left corner|
|`width`|Width of the rectangle|
|`height`|Height of the rectangle|
|`fill`|Fill color|
|`stroke`|Outline color|

- Positioned from top-left corner using `x` and `y`.
### 2. `line` – Straight Line

|Attribute|Description|
|---|---|
|`x1`, `y1`|Starting coordinates|
|`x2`, `y2`|Ending coordinates|
|`stroke`|Line color|
|`stroke-width`|Line thickness|
- Appearance controlled with `stroke`; `fill` is ignored.

### 3. `circle` – Circle

|Attribute|Description|
|---|---|
|`cx`|X position of the center|
|`cy`|Y position of the center|
|`r`|Radius of the circle|
|`fill`|Fill color|
|`stroke`|Outline color|

- Positioned by center coordinates.
### 4. `ellipse` – Ellipse

|Attribute|Description|
|---|---|
|`cx`|X position of the center|
|`cy`|Y position of the center|
|`rx`|Horizontal radius|
|`ry`|Vertical radius|
|`fill`|Fill color|
|`stroke`|Outline color|
- Like a circle but with separate radii.

### 5. `polyline` – Open Shape

|Attribute|Description|
|---|---|
|`points`|List of coordinates for connected lines|
- Sequence of connected straight lines; not closed.

### 6. `polygon` – Closed Shape

|Attribute|Description|
|---|---|
|`points`|List of coordinates; shape is automatically closed|
- Like a `polyline`, but connects last point back to first.

### 7. `path` – Custom Shape

|Attribute|Description|
|---|---|
|`d`|Commands and coordinates for complex paths|

- Most flexible shape; can replicate any of the above.

## Positioning Notes

|Shape Type|Positioning Attributes|
|---|---|
|`rect`|`x`, `y`|
|`circle`, `ellipse`|`cx`, `cy`|
|`line`|`x1`, `y1`, `x2`, `y2`|
|`polyline`, `polygon`|`points`|
|`path`|`d`|
- The SVG canvas acts like a relatively positioned container.
- All shapes are absolutely positioned within it

---
## References
