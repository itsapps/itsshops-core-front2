// index.mts
import * as fs from "fs";
import * as path from "path";
import Nunjucks from "nunjucks";
import { fileURLToPath } from "url";

// _config/filters.mts
import slugifyString from "@sindresorhus/slugify";
function someFilter(value) {
  return `filtered value: ${slugifyString(value)}`;
}

// index.mts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var coreRoot = path.resolve(__dirname);
var templatesRoot = path.join(coreRoot, "templates");
var shopCoreFrontendPlugin = (eleventyConfig, options = {}) => {
  let nunjucksEnvironment = new Nunjucks.Environment(
    new Nunjucks.FileSystemLoader([
      path.resolve("src/_includes"),
      templatesRoot
    ], { noCache: true })
  );
  eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  eleventyConfig.setNunjucksEnvironmentOptions({
    throwOnUndefined: true
  });
  const layoutsDir = path.join(templatesRoot, "layouts");
  for (const file of fs.readdirSync(layoutsDir)) {
    if (!file.endsWith(".njk")) continue;
    const customerLayoutPath = path.join(process.cwd(), eleventyConfig.directories.layouts, file);
    if (fs.existsSync(customerLayoutPath)) {
      continue;
    }
    const content = fs.readFileSync(path.join(layoutsDir, file), "utf-8");
    let layoutPath = eleventyConfig.directories.getLayoutPathRelativeToInputDirectory(file);
    eleventyConfig.addTemplate(layoutPath, content);
  }
  const buildMode = "normal";
  const customerPagesRoot = path.join(eleventyConfig.directories.input, "pages");
  console.log(`\u{1F50D} Checking for pages at: ${customerPagesRoot}`);
  if (fs.existsSync(customerPagesRoot)) {
    for (const dir of fs.readdirSync(customerPagesRoot)) {
      const dirPath = path.join(customerPagesRoot, dir);
      if (!fs.statSync(dirPath).isDirectory()) continue;
      for (const file of fs.readdirSync(dirPath)) {
        if (!file.endsWith(".njk")) continue;
        if (shouldIgnoreTemplate({
          mode: buildMode,
          previewType: "options.preview.documentType",
          dir,
          file,
          features: {}
        })) {
          eleventyConfig.ignores.add(path.join(dirPath, file));
        }
      }
    }
  }
  const corePagesRoot = path.join(templatesRoot, "pages");
  for (const dir of fs.readdirSync(corePagesRoot)) {
    const dirPath = path.join(corePagesRoot, dir);
    if (!fs.statSync(dirPath).isDirectory()) continue;
    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith(".njk")) continue;
      const customerPath = path.join(customerPagesRoot, dir, file);
      const corePath = path.join(dirPath, file);
      if (!shouldIgnoreTemplate({
        mode: buildMode,
        previewType: "options.preview.documentType",
        dir,
        file,
        features: {}
      }) && !fs.existsSync(customerPath)) {
        eleventyConfig.addTemplate(`pages/${dir}/${file}`, fs.readFileSync(corePath, "utf8"));
      }
    }
  }
  eleventyConfig.addFilter("someFilter", someFilter);
};
function shouldIgnoreTemplate({
  mode,
  // 'preview' | 'maintenance' | 'normal'
  previewType,
  // 'page' | 'post'
  dir,
  file,
  features
}) {
  if (mode === "preview") {
    if (dir !== "preview") return true;
    return file !== `${previewType}s.njk`;
  }
  if (mode === "maintenance") {
    return !(dir === "maintenance" && file === "maintenance.njk");
  }
  if (dir === "standard") {
    return false;
  } else if (dir === "preview") {
    return false;
  }
  if (dir === "maintenance") return true;
  return false;
}
export {
  shopCoreFrontendPlugin
};
