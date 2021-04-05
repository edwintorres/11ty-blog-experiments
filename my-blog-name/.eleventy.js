const { DateTime } = require("luxon");
const fs = require("fs");
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");

const sassProcess = require('./build/sass-process');
const imageProcess = require('./build/image-process');
const moment = require("moment");
const en = require("./src/_data/en");
const es = require("./src/_data/es");
const pluginTOC = require('eleventy-plugin-nesting-toc');

module.exports = function (eleventyConfig) {

  //langContent is a object with the label translations for UI components
  const langContent = { ...en, ...es };


  //Plugins
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addPlugin(pluginTOC, 
    {
      tags: ['h3', 'h4'],       // which heading tags are selected headings must each have an ID attribute
      wrapper: 'nav',           // element to put around the root `ol`/`ul`
      wrapperClass: 'toc',      // class for the element around the root `ol`/`ul`
      ul: true,                // if to use `ul` instead of `ol`
      flat: false,              // if subheadings should appear as child of parent or as a sibling
    }
  );


  // ????
  eleventyConfig.setDataDeepMerge(true);


  //Alias
  // eleventyConfig.addLayoutAlias("post", "src/layouts/post.njk");


  //Filters
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat("dd LLL yyyy");
  });
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd');
  });
  // date filter (localized)
  eleventyConfig.addNunjucksFilter("date", function (date, format, locale) {
    locale = locale ? locale : "en";
    moment.locale(locale);
    return moment(date).format(format);
  });
  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addFilter("min", (...numbers) => {
    return Math.min.apply(null, numbers);
  });

  eleventyConfig.addFilter("removeFirstElem", (arr) => {
    newArr = arr.slice();
    newArr.shift();
    return newArr;
  });

  
  //Collections
  //collection of content to be use for front-end search 
  eleventyConfig.addCollection("contentForSearch", function (collection) {
    return collection.getFilteredByGlob(
      [ "src/en/**/*.md"
      , "src/es/**/*.md"
    ]);
  });
  //collection of posts in English
  eleventyConfig.addCollection("posts_en", function (collection) {
    return collection.getFilteredByGlob("src/en/posts/*.md");
  });
  //collection of posts in Spanish
  eleventyConfig.addCollection("posts_es", function (collection) {
    return collection.getFilteredByGlob("./src/es/posts/*.md");
  });
  //t is a collection with the translations of the UI
  eleventyConfig.addCollection("t", function (collection) {
    return langContent;
  });
  //collection of tags
  eleventyConfig.addCollection("tagList", function (collection) {
    let tagSet = new Set();
    collection.getAll().forEach(function (item) {
      if ("tags" in item.data) {
        let tags = item.data.tags;

        tags = tags.filter(function (item) {
          switch (item) {
            // this list should match the `filter` list in tags.njk
            case "all":
            case "nav":
            case "post":
            case "posts":
              return false;
          }

          return true;
        });

        for (const tag of tags) {
          tagSet.add(tag);
        }
      }
    });

    // returning an array in addCollection works in Eleventy 0.5.3
    return [...tagSet];
  });


  //Copy assets
  eleventyConfig.addPassthroughCopy({
    "vendor/css": "assets/vendor/css",
    "src/assets/css": "assets/css",
    "vendor/fonts": "assets/vendor/fonts",
    "src/assets/images": "assets/images",
    "vendor/js": "assets/vendor/js",
    "node_modules/fuse.js/dist/fuse.min.js": "assets/vendor/js/fuse.min.js",
  });


  // Shortcodes
  eleventyConfig.addNunjucksAsyncShortcode('img', imageProcess);


  // Sass pre-processing
  sassProcess('./vendor/scss/style.scss', './public/assets/vendor/css/style.css');


  /* Markdown Overrides */
  let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true
  }).use(markdownItAnchor, {
    permalink: false,
    permalinkClass: "direct-link"
    ,permalinkSymbol: "#"
    ,permalinkBefore: true
  });

  eleventyConfig.setLibrary("md", markdownLibrary);

  eleventyConfig.addPairedShortcode("markdown", (content) => {
    return markdownLibrary.render(content);
  });
  
  // Transform
  eleventyConfig.addTransform("minify", require("./build/transforms/minify"));

  // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync('public/404.html');

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false
  });


  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.dev/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "public"
    }
  };
};
