// netlify/functions/preview2.mts
import Eleventy from "@11ty/eleventy";
import path from "path";
import * as fs from "fs";
var preview2 = async (request, context) => {
  const root = process.cwd();
  const srcPath = path.join(root, "src");
  if (fs.existsSync(srcPath)) {
    console.log("src contents:", fs.readdirSync(srcPath));
  }
  const configPath = path.join(root, "eleventy.config.mts");
  console.log(`configPath at ${configPath} exists?`, fs.existsSync(configPath));
  const inputDir = path.join(root, "src");
  console.log(`inputDir at ${inputDir} exists?`, fs.existsSync(inputDir));
  let result = "Nothing here yet";
  try {
    const elev = new Eleventy("src", void 0, {
      configPath: "eleventy.config.mts",
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
};
export {
  preview2
};
