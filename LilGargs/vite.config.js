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
   base: "/",
  plugins: [
    react(),
    tailwindcss(),
  ],
   server: {
    proxy: {
      // Proxy requests from /api to the Gensuki API server
      '/api': {
        target: 'https://api.gensuki.xyz',
        changeOrigin: true, // Needed for virtual hosted sites
        secure: false,      // If the target API has a self-signed certificate
        ws: true,           // If you want to proxy websockets
      }
    }
  },
  resolve: {
    alias: {
      buffer: path.resolve(__dirname, 'node_modules/buffer/index.js'),
      util: path.resolve(__dirname, 'node_modules/util/util.js'),
      stream: path.resolve(__dirname, 'node_modules/stream-browserify/index.js'),
      // Add polyfill for the 'http' module
      http: path.resolve(__dirname, 'node_modules/stream-http/index.js'),
    },
  },
  optimizeDeps: {
    include: ["buffer", "util", "stream-browserify", "stream-http"],
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
