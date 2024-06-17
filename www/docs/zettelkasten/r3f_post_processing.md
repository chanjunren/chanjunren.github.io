🗓️ 16062024 1600
📎

# r3f_post_processing
## Issues with vanilla post processing
- Each pass results in a re-render
- The same work might be done in each render
	- Depth renders
	- Normal renders
	- etc.


## [Post Processing](https://github.com/pmndrs/postprocessing)
- Aims to solves issue by merging various passes into the least number of passes possible
- Uses the term 'effects' instead
- Order of adding effects is preserved

## Dependencies 
- `@react-three/postprocessing`
- `postprocessing`

```javascript
import { EffectComposer } from '@react-three/postprocessing'

export default function Experience()
{
    return <>

        <EffectComposer>
        </EffectComposer>

        {/* ... */}

    </>
}
```

`EffectComposer` is now running, but the colors are now completely off.
### Fixing tone mapping
- Problems:
	- EffectComposer deactivates tone mapping in post-processing
		- Causes the color to be off
	- `ToneMapping` uses `AgX` tone mapping by default
		- Not the one that R3F uses by default
		- Causes the color to be gray-ish
```javascript
<EffectComposer>
    <ToneMapping mode={ ToneMappingMode.ACES_FILMIC } />
</EffectComposer>
```
![](https://threejs-journey.com/assets/lessons/53/004.png)

```ad-note
Tone mapping is the process of converting HDR colors to LDR output colors
```
### Multisampling
- `multisampling` is used to prevent the aliasing effect 
- Default value is 8

```javascript
// To disable
<EffectComposer multisampling={ 0 }> 
    <ToneMapping mode={ ToneMappingMode.ACES_FILMIC } />
</EffectComposer>
```

![](https://threejs-journey.com/assets/lessons/53/005.jpg)

## Resources
- Post Processing:
	-  [https://github.com/pmndrs/postprocessing](https://github.com/pmndrs/postprocessing)
	- [https://pmndrs.github.io/postprocessing/public/docs/](https://pmndrs.github.io/postprocessing/public/docs/)
	-  [https://pmndrs.github.io/postprocessing/public/demo/](https://pmndrs.github.io/postprocessing/public/demo/)

- React-postprocessing:
	-  [https://github.com/pmndrs/reactpostprocessing](https://github.com/pmndrs/react-postprocessing)
	-  [https://github.com/pmndrs/postprocessing#included-effects](https://github.com/pmndrs/postprocessing#included-effects)
	-  [https://docs.pmnd.rs/react-postprocessing/introduction](https://docs.pmnd.rs/react-postprocessing/introduction)

## Vignette effect 

Makes the corners of the render a little darker.

```javascript
import { Vignette, EffectComposer } from "@react-three/postprocessing"

<EffectComposer>
  <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
  <Vignette offset={0.3} darkness={0.9} />
</EffectComposer>

```

![](https://threejs-journey.com/assets/lessons/53/007.jpg)

## Blending 
- a special attribute named `blendFunction` 
	- available in every effect
- for controlling how a color merges with another color behind it
- there are many blend functions

```javascript
import { BlendFunction, ToneMappingMode } from 'postprocessing'

// To see all available blend functions
console.log(BlendFunction)

<Vignette
    offset={ 0.3 }
    darkness={ 0.9 }
    blendFunction={ BlendFunction.COLOR_BURN }
/>
```
![](https://threejs-journey.com/assets/lessons/53/009.jpg)

### Background bug 
- Vignette effect doesn't work on background
- This is because background is transparent by default (nothing to render there)
- Can fix by adding a color to bg
```javascript
export default function Experience()
{
    return <>

        <color args={ [ '#ffffff' ] } attach="background" />

        {/* ... */}

		<>
}
```

![](https://threejs-journey.com/assets/lessons/53/011.jpg)

## Glitch effect

```javascript
import { Glitch, ToneMapping, Vignette, EffectComposer } from '@react-three/postprocessing'
import { GlitchMode, BlendFunction, ToneMappingMode } from 'postprocessing'


<EffectComposer>
  <Glitch
    delay={[0.5, 1]}
    duration={[0.1, 0.3]}
    strength={[0.2, 0.4]}
    mode={GlitchMode.CONSTANT_MILD}
  />
</EffectComposer>

```

## Noise effect 
```javascript
import { Noise, Glitch, ToneMapping, Vignette, EffectComposer } from '@react-three/postprocessing'

<EffectComposer>
    {/* ... */}
    <Noise
    blendFunction={ BlendFunction.SOFT_LIGHT }
/>
</EffectComposer>
```

![](https://threejs-journey.com/assets/lessons/53/016.jpg)



![](https://threejs-journey.com/assets/lessons/53/017.jpg)
> Enhanced with blend function
```javascript
<Noise
    premultiply
    blendFunction={ BlendFunction.SOFT_LIGHT }
/>
```

![](https://threejs-journey.com/assets/lessons/53/018.jpg)
> `premultiply` will multiply the noise with the input color before applying the blending.

## Bloom effect
- The default `Bloom` tends to make things glow too easily
- Fix by increasing the threshold above which things start to glow using the `luminanceThreshold`

![](https://threejs-journey.com/assets/lessons/53/019.jpg)
> Dark background setup for nicer effect

```javascript
import { Bloom, Noise, Glitch, ToneMapping, Vignette, EffectComposer } from '@react-three/postprocessing'

<EffectComposer>
    {/* ... */}
    <Bloom />
</EffectComposer>
```

![](https://threejs-journey.com/assets/lessons/53/020.jpg)

### How to target objects to glow
- Must set a limitation i.e. `luminanceThreshold`
```javascript
<meshStandardMaterial color={ [ 1.5, 1, 4 ] } />
```
#### Configuring RGB values
1. Set a `luminanceThreshold`
![](https://threejs-journey.com/assets/lessons/53/021.jpg)
> With `luminenceThreshold` increased

![](https://threejs-journey.com/assets/lessons/53/022.jpg)
> Seems like setting the `r` and `b` values to be > 1 cause it to start glowing more
 
![](https://threejs-journey.com/assets/lessons/53/024.jpg)
> Adding `mipmapBlur` to `<Bloom>` allows the object to glow more brightly


#### Emissive Property
1. Setup (make everything orange)
![](https://threejs-journey.com/assets/lessons/53/026.jpg)

2. Add `emissive`, ezpz
```javascript
<meshStandardMaterial color="orange" emissive="orange" />
```
![](https://threejs-journey.com/assets/lessons/53/027.jpg)

3. Making it brighter!
```javascript
<meshStandardMaterial color="orange" emissive="orange" emissiveIntensity={ 2 } />
```

![](https://threejs-journey.com/assets/lessons/53/028.jpg)

4. EVENNN BRIGHTERRRRRR (set color to white)
```javascript
<meshStandardMaterial color="#ffffff" emissive="orange" emissiveIntensity={ 2 } />
```

![](https://threejs-journey.com/assets/lessons/53/029.jpg)

### Uniform emissive
- What is this even (?)
- Use `<meshBasicMaterial`
- Cannot use `emissive` and `emissiveIntensity`
- Can control the `intensity` on `<Bloom>` instead

![](https://threejs-journey.com/assets/lessons/53/031.jpg)

![](https://threejs-journey.com/assets/lessons/53/032.jpg)
> Setting the `luminanceThreshold` to 0 causes everything to glow

## DepthOfField effect 
- This effect will **blur** what’s closer or farther from a set distance.
- Main attributes

| Attribute       | Description                                                                      |
| --------------- | -------------------------------------------------------------------------------- |
| `focusDistance` | At which distance should the image be sharp                                      |
| `focalLength`   | The distance to travel from the `focusDistance` before reaching the maximum blur |
| `bokehScale`    | blur radius                                                                      |
> Values are normalized according to `near` and `far`


```javascript
import { DepthOfField, Bloom, Noise, Glitch, ToneMapping, Vignette, EffectComposer } from '@react-three/postprocessing'
;<EffectComposer>
  {/* ... */}
  <DepthOfField focusDistance={0.025} focalLength={0.025} bokehScale={6} />
</EffectComposer>

```

## Custom effects
- Need to follow Post Processing rules (w.r.t how they merge effects into one shader)
- Resources
	- [https://github.com/pmndrs/postprocessing/wiki/Custom-Effects](https://github.com/pmndrs/postprocessing/wiki/Custom-Effects)
	- [https://github.com/pmndrs/react-postprocessing/blob/master/api.md#custom-effects](https://github.com/pmndrs/react-postprocessing/blob/master/api.md#custom-effects)

```ad-note
Remember that `postprocessing` will take our shader and merge it with the other effect shaders.
```

### Setup
```javascript
import { Effect } from 'postprocessing'

export default class DrunkEffect extends Effect
{
    constructor()
    {
        
    }
}
```
> Effect

```javascript
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{
    
}
```
> Basic vertex shader

```javascript
const fragmentShader = /* glsl */`
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        
    }
`

// ...
```
> Fragment shader 

- `es6-string-html` for syntax highlighting (requires the `/* glsl */`)
- Uses  `WebGL 2 syntax`  
	- `const` > parameter not writeable
	- `in` 
		- copy of the actual variable 
		- changing it won’t affect the source variable 
	- `out` 
		- changing this value will change the variable sent when calling the function.

### Lets start bois
1. Basic purple gradient
```javascript
const fragmentShader = /* glsl */`
    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(uv, 1.0, 1.0);
    }
`
```

2. Hit up the `Effect`
```javascript
export default class DrunkEffect extends Effect
{
    constructor()
    {
        super(
            'DrunkEffect',
            fragmentShader,
            {
                
            }
        )
    }
}
```
>   basic `Post Processing` effect donez
### React-postprocessing implementation

Now, we need to implement it in react-postprocessing.

```javascript
import DrunkEffect from './DrunkEffect.jsx'

export default function Drunk()
{
    const effect = new DrunkEffect()
    
    return <primitive object={ effect } />
}

...

Parent
<EffectComposer>
    {/* ... */}
    <Drunk />
</EffectComposer>
```
![](https://threejs-journey.com/assets/lessons/53/040.jpg)
> Boop
### Props
Goal: make the effect wiggle with a sinus function with a configurable amplitude / frequency

```javascript
export default class DrunkEffect extends Effect
{
    constructor(props)
    {
        super(
            'DrunkEffect',
            fragmentShader,
            {
                
            }
        )

        console.log(props)
    }
}
```
- Use props to pass value


![](https://threejs-journey.com/assets/lessons/53/041.jpg)

### Referencing the primitive
```javascript
import { useRef } from 'react'

export default function Experience()
{
    const drunkRef = useRef()

    // ...
}
```
```javascript
<Drunk
    ref={ drunkRef }
    frequency={ 2 }
    amplitude={ 0.1 }
/>
```

![](https://threejs-journey.com/assets/lessons/53/042.jpg)

- Use `ref` for easy manipulation
- Use `forwardRef` from React (?) because of the warning above ^
```javascript
import { forwardRef } from 'react'

export default forwardRef(function Drunk(props, ref)
{
    const effect = new DrunkEffect(props)
    
    return <primitive ref={ ref } object={ effect } />
```

![](https://threejs-journey.com/assets/lessons/53/043.jpg)

### Getting back the render and make it look greenish
Just need to update the `vertexShader`
```javascript
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
{
    vec4 color = inputColor;
    color.rgb *= vec3(0.8, 1.0, 0.5);

    outputColor = color;

}
```
![](https://threejs-journey.com/assets/lessons/53/045.jpg)

### Wiggle wiggle wiggle
- Make the image wiggle by tweaking `uv` coordinates
- To alter UV coordinates directly, need to implement a `mainUv` function

```ad-note
- `uv` coordinates are used to map textures to surfaces
- `mainImage` function is used for determining the final color of the pixel
- `mainUv` function is for modifying the `uv` coordinates
```
```javascript
const fragmentShader = /* glsl */`
    void mainUv(inout vec2 uv)
    {
	    uv.y += sin(uv.x * 10.0) * 0.1;
    }

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        // ...
    }
`
```
### Using attributes
```javascript
import { Uniform } from 'three'

export default class DrunkEffect extends Effect {
  constructor({ frequency, amplitude }) {
    console.log(frequency, amplitude)
    super(
    'DrunkEffect',
    fragmentShader,
    {
        uniforms: new Map([
            [ 'frequency', new Uniform(frequency) ],
            [ 'amplitude', new Uniform(amplitude) ]
        ])
    }
)

    // ...
  }
}

```
- Need to use [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)
- `Uniform` 
	- standard way to do it
	- enables some methods although we won’t use them.

```javascript
const fragmentShader = /* glsl */`
    uniform float frequency;
    uniform float amplitude;

    void mainUv(inout vec2 uv)
    {
        uv.y += sin(uv.x * frequency) * amplitude;
    }

    // ...
`
```

![](https://threejs-journey.com/assets/lessons/53/050.jpg)

### Controlling attributes with `Leva`
```javascript
import { useControls } from 'leva'

export default function Experience()
{
    // ...

    const drunkProps = useControls('Drunk Effect', {
        frequency: { value: 2, min: 1, max: 20 },
        amplitude: { value: 0.1, min: 0, max: 1 }
    })

    // ...
	<Drunk
    ref={ drunkRef }
    { ...drunkProps }
/>
}
```
### Blending the color

- First, in the `fragmentShader`, we are going to send the green color directly in the `outputColor` and keep the alpha from the `inputColor`:

```javascript
const fragmentShader = /* glsl */`

    // ...

    void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor)
    {
        outputColor = vec4(0.8, 1.0, 0.5, inputColor.a);
    }
`
```

![](https://threejs-journey.com/assets/lessons/53/052.jpg)
> Everything is now green, but here comes the trick. (?? Idk why)

- Need to specify the `blendFunction` for the image to be back
```javascript
<Drunk
    ref={ drunkRef }
    { ...drunkProps }
    blendFunction={ BlendFunction.DARKEN }
/>
```

```javascript
super(
    'DrunkEffect',
    fragmentShader,
    {
        blendFunction: blendFunction,
        // ...
    }
)
```

![](https://threejs-journey.com/assets/lessons/53/054.jpg)

### Animating

1. Add `time`
```javascript
super(
    'DrunkEffect',
    fragmentShader,
    {
        blendFunction: blendFunction,
        uniforms: new Map([
            [ 'frequency', new Uniform(frequency) ],
            [ 'amplitude', new Uniform(amplitude) ],
            [ 'time', new Uniform(0) ]
        ])
    }
)
```
2. Update `fragmentShader`
```javascript
const fragmentShader = /* glsl */`

    uniform float frequency;
    uniform float amplitude;
    uniform float time;

    void mainUv(inout vec2 uv)
    {
        uv.y += sin(uv.x * frequency + time) * amplitude;
    }

    // ...
`
```

3.  Make use of `update` method (called every frame)

```javascript
export default class DrunkEffect extends Effect
{
    // ...

    update()
    {
        console.log('update')
    }
}
```
4. Update `Map`
```javascript
export default class DrunkEffect extends Effect
{
    // ...

    update()
    {
        this.uniforms.get('time').value += 0.02 
    }
}
```
5. Take into account frame rate
```javascript
export default class DrunkEffect extends Effect
{
    // ...

    update(renderer, inputBuffer, deltaTime)
    {
        this.uniforms.get('time').value += deltaTime
    }
}
```


---

# References
