import type { Context, Config } from "@netlify/functions";
// @ts-ignore - Importing Eleventy which might lack types
import Eleventy from '@11ty/eleventy'
import { pathToFileURL } from 'url';
import path from 'path';
import * as fs from 'fs';

// import slugifyString from '@sindresorhus/slugify';

interface ElevResult {
  inputPath: string;
  content: string;
}

// export const coreConfig = {
//   path: "/preview"
// };
export const config: Config = {
  path: "/preview" 
};

export default async function (): Promise<Response> {
  let result = "bla"
  const root = process.cwd();
  const inputDir = "./src";
  const absoluteConfigPath = path.join(root, "eleventy.config.mts");
  console.log("absoluteConfigPath", absoluteConfigPath);
  try {
    const elev = new Eleventy(path.join(root, "src"), undefined, {
      configPath: absoluteConfigPath,
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
