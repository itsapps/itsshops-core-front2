// netlify/functions/preview3.mts
import Eleventy from "@11ty/eleventy";
import path from "path";
import * as fs from "fs";
var preview3 = async (request, context) => {
  try {
    const root = process.cwd();
    const srcPath = path.join(root, "src");
    if (!fs.existsSync(srcPath)) {
      throw new Error(`CORE: srcPath at ${srcPath} does not exist!`);
    }
    const configPath = path.join(root, "eleventy.config.mts");
    const configExists = fs.existsSync(configPath);
    console.log(`CORE: configPath at ${configPath} exists?`, configExists);
  } catch (err) {
    return new Response(`CORE: ${err}`, { status: 500 });
  }
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
  preview3
};
