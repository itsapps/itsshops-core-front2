// netlify/functions/preview2.mts
import Eleventy from "@11ty/eleventy";
import path from "path";
import * as fs from "fs";
var preview2 = async (request, context) => {
  let result = "bla";
  const inputDir = "./src";
  console.log("Checking for input directory at:", inputDir);
  if (!fs.existsSync(inputDir)) {
    console.error("INPUT DIRECTORY MISSING!");
  }
  const absoluteConfigPath = path.join(inputDir, "eleventy.config.mts");
  console.log("absoluteConfigPath", absoluteConfigPath);
  try {
    const elev = new Eleventy(inputDir, void 0, {
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
