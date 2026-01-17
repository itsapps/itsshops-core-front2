import fs from 'fs-extra';
import path from 'path';
import * as TOML from '@iarna/toml';

export async function syncNetlifyConfig() {
  const root = process.cwd();
  const tomlPath = path.join(root, 'netlify.toml');

  // These are the "Non-negotiable" settings for your framework
  const frameworkSettings = {
    build: {
      command: "npm run build",
      publish: "dist",
    },
    dev: {
      autoLaunch: false,
    },
    functions: {
      preview: {
        node_bundler: "esbuild",
        external_node_modules: ["@sindresorhus/slugify"],
        included_files: [
          "eleventy.config.mts",
          "src/**",
          "shared/**",
          "tsconfig.json",
          "node_modules/@sindresorhus/**"
        ]
      }
    }
  };

  let config = {};
  if (await fs.pathExists(tomlPath)) {
    try {
      config = TOML.parse(await fs.readFile(tomlPath, 'utf8'));
    } catch (e) {
      console.warn("⚠️ Existing netlify.toml is invalid. Overwriting...");
    }
  }

  // Deep merge functions config
  const mergedConfig = {
    ...config,
    ...frameworkSettings
  };

  await fs.writeFile(tomlPath, TOML.stringify(mergedConfig));
  console.log("🚀 Netlify configuration synchronized.");
}