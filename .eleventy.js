// .eleventy.js
const pluginNavigation = require("@11ty/eleventy-navigation");
const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");

// Responsive image shortcode for Nunjucks:
// Usage: {% image "/assets/filename.png", "Alt text" %}
async function imageShortcode(src, alt, sizes = "(max-width: 900px) 90vw, 900px") {
  const raw = String(src).replace(/^\/+/, "");     // strip leading slash
  const srcPath = path.join("src", raw);           // resolve under /src

  const outDir = "assets/img";
  const metadata = await Image(srcPath, {
    widths: [480, 768, 1024, null],                // include original
    formats: ["webp", "jpeg", "png"],
    outputDir: path.join("_site", outDir),
    urlPath: "/" + outDir
  });

  const attrs = { alt, sizes, loading: "lazy", decoding: "async" };
  return Image.generateHTML(metadata, attrs);
}

module.exports = function(eleventyConfig) {
  // Plugins
  eleventyConfig.addPlugin(pluginNavigation);

  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addShortcode("year", () => String(new Date().getFullYear()));
  eleventyConfig.addShortcode("versioned", (p) => {
    const rel = p.startsWith("/") ? p.slice(1) : p;
    try {
      const mtime = fs.statSync(path.join("src", rel)).mtimeMs.toString(36);
      return `${p}?v=${mtime}`;
    } catch {
      return p; // fallback if file missing
    }
  });

  // Static passthrough (copy /src/assets -> /assets)
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });

  // Watch assets
  eleventyConfig.addWatchTarget("src/assets");

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" }
  };
};
