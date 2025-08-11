// .eleventy.js
const pluginNavigation = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const path = require("path");

// Responsive image shortcode for Nunjucks:
// Usage: {% image "/assets/filename.png", "Alt text" %}  OR  {% image "assets/filename.png", "Alt text" %}
async function imageShortcode(src, alt, sizes = "(max-width: 900px) 90vw, 900px") {
  // Always resolve relative to /src even if src starts with a leading slash
  const raw = String(src).replace(/^\/+/, "");     // strip any leading "/"
  const srcPath = path.join("src", raw);           // e.g., src/assets/filename.png

  const outDir = "assets/img";                     // build output subdir
  const metadata = await Image(srcPath, {
    widths: [480, 768, 1024, null],                // null includes original width
    formats: ["webp", "jpeg", "png"],
    outputDir: path.join("_site", outDir),         // where processed images are written
    urlPath: "/" + outDir                          // how they’re referenced in HTML
  });

  const imageAttributes = { alt, sizes, loading: "lazy", decoding: "async" };
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginNavigation);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));

  // Static passthrough (keeps raw assets available at /assets)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Watch assets in dev
  eleventyConfig.addWatchTarget("src/assets");

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" }
  };
};
