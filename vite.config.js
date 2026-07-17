import { defineConfig } from 'vite';
import monkey from 'vite-plugin-monkey';

export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.js',
      userscript: {
        name: 'GoodLore',
        namespace: 'https://github.com/soda92/goodlore',
        version: '1.0.0',
        description: 'A premium, modern, and highly interactive user experience for lore.kernel.org threads. Includes light/dark mode, thread filtering, hierarchical indent guidelines, visual reply templates, and font/size controls.',
        match: ['https://lore.kernel.org/*'],
        grant: 'none',
        'run-at': 'document-end'
      },
    }),
  ],
});
