// .eleventy.js
const pluginNavigation = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const path = require("path");

// Responsive image shortcode for Nunjucks: {% image "/assets/filename.png", "Alt text" %}
async function imageShortcode(src, alt, sizes = "(max-width: 900px) 90vw, 900px") {
  // Output dir in the built site; URLs will be /assets/img/...
  const outDir = "assets/img";
  // Resolve source path relative to /src
  const srcPath = src.startsWith("/") ? path.join("src", src) : path.join("src", src);

  const metadata = await Image(srcPath, {
    widths: [480, 768, 1024, null],           // last null keeps original width
    formats: ["webp", "jpeg", "png"],         // webp + fallbacks
    outputDir: path.join("_site", outDir),    // where processed images go in the build
    urlPath: "/" + outDir                     // how they’re referenced in HTML
  });

  const imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };

  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginNavigation);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);

  // Static passthrough (keeps raw assets available at /assets)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Recommended: watch assets for changes in --serve
  eleventyConfig.addWatchTarget("src/assets");

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" }
  };
};
