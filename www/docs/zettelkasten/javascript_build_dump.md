🗓️ 20240603 1042
📎 #javascript_build

# javascript_build_dump
## Webpack

- A static module bundler for JavaScript applications
- It processes and bundles various types of files (e.g., JavaScript, CSS, images) into a smaller set of files that are easier to serve

### Key Concepts
- **Entry**: The entry point(s) for the application.
- **Output**: The location and filename of the bundled files.
- **Loaders**: Transformations applied to modules (e.g., `babel-loader` for JavaScript, `css-loader` for CSS).
- **Plugins**: Extend Webpack's functionality (e.g., `HtmlWebpackPlugin` for generating HTML files).
- **Configuration File**: Typically `webpack.config.js`, where the entry, output, loaders, and plugins are defined.

## Vite

- Next-generation frontend build tool that focuses on speed and performance, leveraging modern JavaScript features.

**Key Features**:
- **Dev Server**: Fast, with hot module replacement (HMR).
- **Build**: Optimized production build using Rollup.
- **Native ES Modules**: Uses ES modules in development, reducing the need for bundling.

**Why Vite Handles Imports Better**:

- Built-in support for various file types.
- Optimized handling of dependencies.
- Minimal configuration for common tasks.

## Plugins

- Plugins are tools that extend the functionality of the bundler (In the context of Webpack and other build tools)
- Perform a variety of tasks e.g.
	- Optimizing output
	- Injecting environment variables
	- etc
## Loaders

**Definition**: Loaders are used in Webpack to transform files into modules that can be included in the dependency graph. They preprocess files as they are imported.

**Common Loaders**:

- `babel-loader`: Transpile JavaScript using Babel.
- `css-loader`: Handle CSS imports.
- `file-loader`: Import files as URLs.
- `glsl-shader-loader`: Handle GLSL shader files.

## CommonJS (CJS)

**Definition**: CommonJS is a module system used in Node.js. It uses `require` and `module.exports` for importing and exporting modules.

**Example**:

javascript

Copy code

`// Importing a module const module = require('module-name');  // Exporting a module module.exports = function() {   // module code };`

### 6. ES Modules (ESM)

**Definition**: ES Modules is a standardized module system used in modern JavaScript. It uses `import` and `

`export` for module management.

**Example**:

javascript

Copy code

`// Importing a module import module from 'module-name';  // Exporting a module export function myFunction() {   // module code }`

### 7. Docusaurus

**Definition**: Docusaurus is an open-source project for building, deploying, and maintaining open-source project websites easily. It is highly customizable and built using React.

**Key Features**:

- **MDX Support**: Combine Markdown with JSX.
- **Versioning**: Version your documentation.
- **Translations**: Internationalize your site with ease.
- **Plugins**: Extend the functionality of your Docusaurus site.

### 8. Configuration Customization in Docusaurus

**Customizing Webpack**:

- **Custom Webpack Plugin**: To add custom configurations to Webpack, you can create a plugin that modifies Webpack's configuration.

**Example**:

javascript

Copy code

`module.exports = function(context, options) {   return {     name: 'custom-webpack-plugin',     configureWebpack(config, isServer) {       return {         module: {           rules: [             {               test: /\.glsl$/,               use: 'glsl-shader-loader',             },             {               test: /\.(gif|png|jpe?g|svg)$/i,               exclude: /\.(mdx?)$/i,               use: ['file-loader', { loader: 'image-webpack-loader' }],             },           ],         },       };     },   }; };`

### 9. Putting It All Together

**Problem Context**: Importing GLSL shader files in a Docusaurus project.

- **Issue**: Docusaurus, by default, does not have a loader for GLSL files, leading to a module parse error.
- **Solution**: Customize Webpack configuration to include `glsl-shader-loader`.

**Steps**:

1. **Install glsl-shader-loader**:
    
    bash
    
    Copy code
    
    `npm install glsl-shader-loader --save-dev`
    
2. **Create a Custom Webpack Plugin** (`custom-webpack-plugin.cjs`):
    
    javascript
    
    Copy code
    
    `module.exports = function(context, options) {   return {     name: 'custom-webpack-plugin',     configureWebpack(config, isServer) {       return {         module: {           rules: [             {               test: /\.glsl$/,               use: 'glsl-shader-loader',             },             {               test: /\.(gif|png|jpe?g|svg)$/i,               exclude: /\.(mdx?)$/i,               use: ['file-loader', { loader: 'image-webpack-loader' }],             },           ],         },       };     },   }; };`
    
3. **Include the Plugin in `docusaurus.config.ts`**:
    
    typescript
    
    Copy code
    
    `import { Config } from '@docusaurus/types'; import tailwindPlugin from './tailwind-plugin.cjs'; import idealImagePlugin from './plugin-ideal-image.cjs'; import customWebpackPlugin from './custom-webpack-plugin.cjs'; import path from 'path';  const config: Config = {   // other configurations...   plugins: [     tailwindPlugin,     [       idealImagePlugin.name,       idealImagePlugin.options,     ],     customWebpackPlugin,   ], };  export default config;`
    

By understanding these concepts and how they interrelate, you can effectively troubleshoot and resolve issues related to module bundling and configuration in your projects.

---

# References
