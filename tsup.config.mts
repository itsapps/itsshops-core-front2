import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.mts',
    preview: 'netlify/functions/preview.mts',
    preview2: 'netlify/functions/preview2.mts',
    preview3: 'netlify/functions/preview3.mts',
  },
  format: ['esm'],
  dts: true,        // Generates .d.ts files
  splitting: false, // Often safer for Netlify functions to avoid shared chunks
  clean: true,
});