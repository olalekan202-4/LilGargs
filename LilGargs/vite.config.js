import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Using tailwindcss as a Vite plugin
  ],
  resolve: {
    alias: {
      buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
      util: path.resolve(__dirname, 'node_modules/util/util.js'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify/index.js'),
    },
  },
  optimizeDeps: {
    include: ["buffer", "util", "stream-browserify"],
  },
  define: {
    global: 'window',
    process: {
      env: {},
      browser: true,
      cwd: () => '/',
      nextTick: (fn) => setTimeout(fn, 0),
      version: 'v0.0.0',
      platform: 'browser',
      versions: {},
      binding: (name) => {
        console.warn(`process.binding('${name}') called, but not supported in browser.`);
        return {};
      },
      stdout: {},
      stderr: {},
    },
  },
});