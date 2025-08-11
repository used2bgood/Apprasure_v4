const Image = require("@11ty/eleventy-img");
const path = require("path");

async function imageShortcode(src, alt, sizes = "(max-width: 900px) 90vw, 900px") {
  let outDir = "assets/img";
  let srcPath = src.startsWith("/") ? path.join("src", src) : path.join("src", src);
  let metadata = await Image(srcPath, {
    widths: [480, 768, 1024, null],
    formats: ["webp", "jpeg", "png"],
    outputDir: path.join("_site", outDir),
    urlPath: "/" + outDir
  });
  let imageAttributes = {
    alt,
    sizes,
    loading: "lazy",
    decoding: "async"
  };
  return Image.generateHTML(metadata, imageAttributes);
}

module.exports = function(eleventyConfig) {
  eleventyConfig.addNunjucksAsyncShortcode("image", imageShortcode);
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" }
  };
};
