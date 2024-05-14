---
sidebar_position: 2
sidebar_label: GLTF
---

# GLTF

## Introduction
- GLTF (Graphics Language Transmission Format) is a standard file format for three-dimensional scenes and models. It's JSON-based and efficient for transmitting and loading 3D content on the web.
- It contains information about 3D models such as meshes, textures, materials, animations, and more.
- GLTF is often referred to as the "JPEG of 3D" because of its ability to efficiently compress and transmit 3D data.

## Why Use a Decoder?
Compression: GLTF models can be large, making them slow to download and process. Compression helps reduce the file size.
DRACO Compression: A method for compressing mesh geometry to significantly reduce the size of GLTF files. It reduces the amount of data needed to represent 3D objects.
Decoder's Role: When a GLTF file is compressed using Draco, it cannot be directly read by Three.js or other 3D engines. A decoder is needed to uncompress the file and translate it into a format that Three.js can understand and render.

## Performance Trade-off
While Draco reduces file size, decoding it requires additional processing time and resources, potentially causing a short freeze in your application.

## Use Case
Use Draco when handling large or numerous models where the initial load time is less critical. For smaller models or applications where immediate responsiveness is crucial, standard GLTF might be more suitable.

## Summary
In summary, the use of GLTF and Draco in Three.js is about balancing the file size and the performance of your 3D application