import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'index.ts',
    preview: 'netlify/functions/preview.ts',
  },
  format: ['esm'],
  dts: true,        // Generates .d.ts files
  splitting: false, // Often safer for Netlify functions to avoid shared chunks
  clean: true,
});