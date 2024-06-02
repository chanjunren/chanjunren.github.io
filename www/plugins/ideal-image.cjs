module.exports = {
  name: "@docusaurus/plugin-ideal-image",
  options: {
    quality: 70,
    max: 1030, // max resized image's size.
    min: 640, // min resized image's size. if original is lower, use that size.
    steps: 2, // the max number of images generated between min and max (inclusive)
    disableInDev: false,
  },
};
