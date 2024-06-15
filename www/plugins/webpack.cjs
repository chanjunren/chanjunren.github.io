module.exports = function (context, options) {
  return {
    name: "custom-webpack-plugin",
    configureWebpack(config, isServer) {
      return {
        module: {
          rules: [
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
