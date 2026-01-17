// import type { Context, Config } from "@netlify/functions";
// @ts-ignore - Importing Eleventy which might lack types
import Eleventy from '@11ty/eleventy'

// import slugifyString from '@sindresorhus/slugify';

interface ElevResult {
  inputPath: string;
  content: string;
}

// export const coreConfig = {
//   path: "/preview"
// };

export const coreHandler = async (callback: () => string): Promise<string> => {
  let result = "bla"
  const inputDir = "./src";
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
  return result + callback();
  // return new Response(result, {
  //   headers: {
  //     "content-type": "text/html",
  //   }
  // });
};
