import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {defineConfig} from 'vite';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(rootDir, 'dist');
          const srcAssets = path.resolve(rootDir, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
          const indexHtml = path.resolve(distDir, 'index.html');
          const fallback404 = path.resolve(distDir, '404.html');
          if (fs.existsSync(indexHtml)) {
            fs.copyFileSync(indexHtml, fallback404);
          }
        },
      },
      {
        name: 'serve-moodle-zip-download',
        apply: 'serve',
        configureServer(server) {
          server.middlewares.use('/diploma-estudios-africanos-moodle.zip', (_req, res, next) => {
            const zipPath = path.resolve(
              rootDir,
              'moodle-export/diploma-estudios-africanos-moodle.zip'
            );
            if (!fs.existsSync(zipPath)) {
              next();
              return;
            }
            const stat = fs.statSync(zipPath);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/zip');
            res.setHeader('Content-Length', String(stat.size));
            res.setHeader(
              'Content-Disposition',
              'attachment; filename="diploma-estudios-africanos-moodle.zip"'
            );
            fs.createReadStream(zipPath).pipe(res);
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(rootDir, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/three')) {
              return 'vendor-three';
            }
            if (
              id.includes('node_modules/d3') ||
              id.includes('node_modules/topojson-client') ||
              id.includes('node_modules/world-atlas')
            ) {
              return 'vendor-d3';
            }
          },
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
