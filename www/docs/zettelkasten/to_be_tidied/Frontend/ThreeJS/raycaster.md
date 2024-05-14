---
sidebar_position: 3
sidebar_label: Raycaster
---

# Raycaster

## Introduction
As the name suggests, a Raycaster can cast (or shoot) a ray in a specific direction and test what objects intersect with it.

You can use that technique to detect if there is a wall in front of the player, test if the laser gun hit something, test if something is currently under the mouse to simulate mouse events, and many other things.

## Why Convert Mouse Coordinates
### Native JavaScript Coordinates
- In a web browser, the mouse position is typically given in pixels relative to the top-left corner of the browser window
- The x-coordinate increases to the right, and the y-coordinate increases downwards

### WebGL/Three.js Coordinate System
- In WebGL and libraries like Three.js, the coordinate system is different
- It's normalized to a range from -1 to 1
- The center of the screen is (0, 0), the far left is (-1), the far right is (1), the top is (1) and the bottom is (-1)
- This system is used for calculations like raycasting
