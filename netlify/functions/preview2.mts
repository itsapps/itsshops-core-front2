// @ts-ignore - Importing Eleventy which might lack types
import Eleventy from '@11ty/eleventy'
import path from 'path';
import * as fs from 'fs';

interface ElevResult {
  inputPath: string;
  content: string;
}

export const preview2 = async (text: string) => {
  let result = "bla"
  // const root = process.cwd();
  const inputDir = "./src";
  // const inputDir = path.join(root, "src");
  console.log("Checking for input directory at:", inputDir);
  if (!fs.existsSync(inputDir)) {
    console.error("INPUT DIRECTORY MISSING!");
    // fs.mkdirSync(inputDir, { recursive: true });
    // fs.writeFileSync(path.join(inputDir, "index.md"), "# Fallback Content");
    // This helps you see if it's a path issue or a missing file issue
  }
  const absoluteConfigPath = path.join(inputDir, "eleventy.config.mts");
  console.log("absoluteConfigPath", absoluteConfigPath);
  try {
    const elev = new Eleventy(inputDir, undefined, {
      configPath: "eleventy.config.mts",
      quietMode: true
    });

    // Don’t write to disk — just render in memory
    const results = (await elev.toJSON()) as unknown as ElevResult[]

    result = results[0].content
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      result = error.message
    }
  }
  // return result
  // return "result"
  return new Response(result, {
    headers: {
      "content-type": "text/html",
    }
  });
};
