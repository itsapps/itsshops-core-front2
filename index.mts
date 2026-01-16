import fs from "fs"
import path from "path"
import Nunjucks from "nunjucks"
import { fileURLToPath } from "url"
// import {
//   EleventyRenderPlugin,
//   EleventyI18nPlugin,
// } from '@11ty/eleventy';
import { someFilter } from './_config/filters.mts';

// Convert current module URL to a directory path
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const coreRoot = path.resolve(__dirname)
// const assetsRoot = path.join(coreRoot, "assets")
const templatesRoot = path.join(coreRoot, "templates")

export const shopCoreFrontendPlugin = (eleventyConfig: any, options = {
  
}) => {
  /*
   * Nunjucks - templates overrides
   */
  let nunjucksEnvironment = new Nunjucks.Environment(
		new Nunjucks.FileSystemLoader([
      path.resolve("src/_includes"),
      templatesRoot,
    ], { noCache: true })
	);
	eleventyConfig.setLibrary("njk", nunjucksEnvironment);
  eleventyConfig.setNunjucksEnvironmentOptions({
		throwOnUndefined: true,
	});
  

  // layouts
  const layoutsDir = path.join(templatesRoot, "layouts")
  for (const file of fs.readdirSync(layoutsDir)) {
    if (!file.endsWith(".njk")) continue
    const customerLayoutPath = path.join(process.cwd(), eleventyConfig.directories.layouts, file)
    if (fs.existsSync(customerLayoutPath)) {
      continue // layout exists, so use this one instead of the one from core
    }

    const content = fs.readFileSync(path.join(layoutsDir, file), "utf-8")
    let layoutPath = eleventyConfig.directories.getLayoutPathRelativeToInputDirectory(file);
    eleventyConfig.addTemplate(layoutPath, content)
    // eleventyConfig.addLayoutAlias(file.replace(".njk", ""), file);
  }
  const buildMode = 'normal'

  const customerPagesRoot = path.join(eleventyConfig.directories.input, 'pages')
  for (const dir of fs.readdirSync(customerPagesRoot)) {
    const dirPath = path.join(customerPagesRoot, dir)
    if (!fs.statSync(dirPath).isDirectory()) continue

    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith('.njk')) continue

      if (shouldIgnoreTemplate({
        mode: buildMode,
        previewType: "options.preview.documentType",
        dir,
        file,
        features: {}
      })) {
        eleventyConfig.ignores.add(path.join(dirPath, file))
      }
    }
  }

  const corePagesRoot = path.join(templatesRoot, 'pages')
  for (const dir of fs.readdirSync(corePagesRoot)) {
    const dirPath = path.join(corePagesRoot, dir)
    if (!fs.statSync(dirPath).isDirectory()) continue

    for (const file of fs.readdirSync(dirPath)) {
      if (!file.endsWith('.njk')) continue

      const customerPath = path.join(customerPagesRoot, dir, file)
      const corePath = path.join(dirPath, file)

      if (
        !shouldIgnoreTemplate({
          mode: buildMode,
          previewType: "options.preview.documentType",
          dir,
          file,
          features: {}
        }) &&
        !fs.existsSync(customerPath)
      ) {
        eleventyConfig.addTemplate(`pages/${dir}/${file}`, fs.readFileSync(corePath, 'utf8'))
      }
    }
  }

  eleventyConfig.addFilter("someFilter", someFilter);
}

function shouldIgnoreTemplate({
  mode,          // 'preview' | 'maintenance' | 'normal'
  previewType,   // 'page' | 'post'
  dir,
  file,
  features
}: {mode: string, previewType: string, dir: string, file: string, features: any}) {
  /* ------------------------------
   * PREVIEW MODE (selected doc only)
   * ------------------------------ */
  if (mode === 'preview') {
    if (dir !== 'preview') return true
    return file !== `${previewType}s.njk`
  }

  /* ------------------------------
   * MAINTENANCE MODE
   * ------------------------------ */
  if (mode === 'maintenance') {
    return !(dir === 'maintenance' && file === 'maintenance.njk')
  }

  /* ------------------------------
   * NORMAL MODE
   * ------------------------------ */

  // Feature-gated normal pages
  if (dir === 'standard') {
    return false
  }
  else if (dir === 'preview') {
    return false
  }

  // All other directories
  // Preview templates are enabled in normal mode
  // Maintenance templates ignored in normal mode
  if (dir === 'maintenance') return true

  return false
}
