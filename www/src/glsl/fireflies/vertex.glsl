uniform float uPixelRatio;
uniform float uSize;
uniform float uTime;

attribute float aScale;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.y += sin(uTime + modelPosition.x * 100.0) * aScale * 0.3;
    modelPosition.x += cos(uTime + modelPosition.x * 100.0) * aScale * 0.3;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;


    gl_Position = projectionPosition;
    // Ensures same particle size regardless of screen's pixel ratio  + Controlling size of particle
    gl_PointSize = uSize * aScale * uPixelRatio;
    // Particle size should change depending on distance to the camera
    gl_PointSize *= (1.0 / - viewPosition.z);
}