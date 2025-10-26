🗓️ 11052025 2125

# texture_transformations


```ad-quote
- Texture transformations in threeJS can be used to adjust the display of  [[textures_3js]] without altering the UV map itself

- Useful for things like tiled textures on floors or walls.

- However, if you want a texture to fit precisely to a certain area of a model, you would need to adjust the UV map in a 3D modeling tool (like Blender) to correspond to the desired areas of the texture.
```

## Repeat

You can repeat the texture using the `repeat` property, which is a [Vector2](https://threejs.org/docs/index.html#api/en/math/Vector2), meaning that it has `x` and `y` properties.

Try to change these properties:

```javascript
const colorTexture = textureLoader.load('/textures/door/color.jpg')
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.repeat.x = 2
colorTexture.repeat.y = 3
```

![](https://threejs-journey.com/assets/lessons/11/011.png)

As you can see, the texture is not repeating, but it is smaller, and the last pixel seems stretched.

That is due to the texture not being set up to repeat itself by default. To change that, you have to update the `wrapS` and `wrapT` properties using the `THREE.RepeatWrapping` constant.

- `wrapS` is for the `x` axis
- `wrapT` is for the `y` axis

```javascript
colorTexture.wrapS = THREE.RepeatWrapping
colorTexture.wrapT = THREE.RepeatWrapping
```

![](https://threejs-journey.com/assets/lessons/11/012.png)

You can also alternate the direction with `THREE.MirroredRepeatWrapping`:

```javascript
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
```

![](https://threejs-journey.com/assets/lessons/11/013.png)

## Offset

You can offset the texture using the `offset` property that is also a [Vector2](https://threejs.org/docs/index.html#api/en/math/Vector2) with `x` and `y` properties. Changing these will simply offset the UV coordinates:

```javascript
colorTexture.offset.x = 0.5
colorTexture.offset.y = 0.5
```

![](https://threejs-journey.com/assets/lessons/11/014.png)

## Rotation

You can rotate the texture using the `rotation` property, which is a simple number corresponding to the angle in radians:

```javascript
colorTexture.rotation = Math.PI * 0.25
```

![](https://threejs-journey.com/assets/lessons/11/015.png)

If you remove the `offset` and `repeat` properties, you'll see that the rotation occurs around the bottom left corner of the cube's faces:

![](https://threejs-journey.com/assets/lessons/11/016.png)

That is, in fact, the `0, 0` UV coordinates. If you want to change the pivot of that rotation, you can do it using the `center` property which is also a [Vector2](https://threejs.org/docs/index.html#api/en/math/Vector2):

```javascript
colorTexture.rotation = Math.PI * 0.25
colorTexture.center.x = 0.5
colorTexture.center.y = 0.5
```

The texture will now rotate on its center.

![](https://threejs-journey.com/assets/lessons/11/017.png)


---
## References
