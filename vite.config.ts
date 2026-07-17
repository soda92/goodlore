import { defineConfig } from 'vite';
import preact from '@preact/preset-vite';
import monkey from 'vite-plugin-monkey';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  server: {
    port: 9280,
    host: '127.0.0.1',
    https: true
  },
  plugins: [
    preact(),
    basicSsl(),
    monkey({
      entry: 'src/main.tsx',
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
