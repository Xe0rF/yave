import { defineConfig } from 'vite';
import { execSync } from 'node:child_process';

function getCommit() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch {
    return 'dev';
  }
}

const commit = getCommit();

export default defineConfig({
  define: {
    __YAVE_COMMIT__: JSON.stringify(commit),
  },
  publicDir: 'site',
  plugins: [
    {
      name: 'yave-banner',
      generateBundle(_, bundle) {
        for (const file of Object.values(bundle)) {
          if (file.type === 'chunk' && file.fileName === 'yave.js') {
            file.code = `/*! yave @ ${commit} | Lucide icons ISC */\n` + file.code;
          }
        }
      },
    },
  ],
  build: {
    lib: {
      entry: 'src/main.js',
      name: 'Yave',
      formats: ['iife'],
      fileName: () => 'yave.js',
    },
    emptyOutDir: true,
  },
});
