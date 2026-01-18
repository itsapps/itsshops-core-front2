// netlify/functions/preview.mts
import Eleventy from "@11ty/eleventy";
import { pathToFileURL } from "url";
import path from "path";
import * as fs from "fs";
var config = {
  path: "/preview"
};
async function preview_default(request, context) {
  let result = "bla";
  const root = process.cwd();
  console.log("--- DEBUG START ---");
  console.log("Current Working Directory:", root);
  try {
    console.log("Files in root:", fs.readdirSync(root));
    const nodeModulesPath = path.join(root, "node_modules", "@itsapps", "itsshops-core-front2");
    if (fs.existsSync(nodeModulesPath)) {
      console.log("Core Package found at:", nodeModulesPath);
      console.log("Core Package contents:", fs.readdirSync(nodeModulesPath));
      if (fs.existsSync(path.join(nodeModulesPath, "dist"))) {
        console.log("Dist contents:", fs.readdirSync(path.join(nodeModulesPath, "dist")));
      }
    } else {
      console.log("CRITICAL: Core Package NOT found in node_modules!");
    }
  } catch (err) {
    console.log("Diagnostic failed:", err.message);
  }
  console.log("--- DEBUG END ---");
  const inputDir = path.join(root, "src");
  const configPath = path.join(root, "eleventy.config.mts");
  const configUrl = pathToFileURL(configPath).href;
  const absoluteConfigPath = path.join(root, "eleventy.config.mts");
  console.log("configPath", configPath);
  console.log("absoluteConfigPath", absoluteConfigPath);
  console.log("Checking for input directory at:", inputDir);
  if (!fs.existsSync(inputDir)) {
    console.error("INPUT DIRECTORY MISSING!");
  }
  try {
    const elev = new Eleventy(inputDir, void 0, {
      configPath: absoluteConfigPath,
      quietMode: true
    });
    const results = await elev.toJSON();
    result = results[0].content;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      result = error.message;
    }
  }
  return new Response(result, {
    headers: {
      "content-type": "text/html"
    }
  });
}
export {
  config,
  preview_default as default
};
