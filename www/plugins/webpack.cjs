module.exports = function (context, options) {
  return {
    name: "custom-webpack-plugin",
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
            {
              test: /\.(gif|png|jpe?g|svg)$/i,
              exclude: /\.(mdx?)$/i,
              use: ["file-loader", { loader: "image-webpack-loader" }],
            },
            {
              test: /\.glsl$/,
              use: "glsl-shader-loader",
            },
          ],
        },
      };
    },
  };
};
