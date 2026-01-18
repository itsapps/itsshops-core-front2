import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.mts',         // Becomes dist/index.js
    preview2: 'netlify/functions/preview2.mts' // Becomes dist/preview2.js
  },
  format: ['esm'],
  dts: true,        // Generates the .d.ts files you listed in exports
  splitting: false, // Often safer for Netlify functions to avoid shared chunks
  clean: true,
});