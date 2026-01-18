import type { Context } from "@netlify/functions";
// @ts-ignore - Importing Eleventy which might lack types
import Eleventy from '@11ty/eleventy'
import path from 'path';
import * as fs from 'fs';

interface ElevResult {
  inputPath: string;
  content: string;
}

export const preview2 = async (request: Request, context: Context) => {
  // const root = process.cwd();

  // const srcPath = path.join(root, "src");
  // if (fs.existsSync(srcPath)) {
  //   console.log("src contents:", fs.readdirSync(srcPath));
  // }

  // const configPath = path.join(root, "eleventy.config.mts");
  // console.log(`configPath at ${configPath} exists?`, fs.existsSync(configPath));
  
  // const inputDir = path.join(root, "src");
  // console.log(`inputDir at ${inputDir} exists?`, fs.existsSync(inputDir));

  // const coreModulePath = path.join(root, "node_modules", "@itsapps", "itsshops-core-front2");
  // console.log(`coreModulePath at ${coreModulePath} exists?`, fs.existsSync(coreModulePath));

  let result = "Nothing here yet"
  try {
    const elev = new Eleventy('src', undefined, {
      configPath: 'eleventy.config.mts',
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
