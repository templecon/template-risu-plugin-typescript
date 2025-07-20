import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { sveltePreprocess } from "svelte-preprocess";
import wasm from "vite-plugin-wasm";
import { internalIpV4 } from 'internal-ip'
import topLevelAwait from "vite-plugin-top-level-await";
import strip from '@rollup/plugin-strip';
import dts from 'unplugin-dts/vite';


// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    plugins: [
      svelte({
        preprocess: [
          sveltePreprocess({
            typescript: true,
          }),
        ],
        onwarn: (warning, handler) => {
          // disable a11y warnings
          if (warning.code.startsWith("a11y-")) return;
          handler(warning);
        },
      }),
      wasm(),
      command === 'build' ? strip({
        include: '**/*.(mjs|js|svelte|ts)'
      }) : null,
      dts({
        declarationOnly: true,
        outDir: '{}{}{}dist{}{}{}',
      })
    ],

    // to make use of `TAURI_DEBUG` and other env variables
    // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
    envPrefix: ["VITE_", "TAURI_"],
    build: {
      // Tauri supports es2021
      target: ['safari15', 'chrome100', 'firefox100', 'edge100'],
      // don't minify for debug builds
      minify: process.env.TAURI_DEBUG ? false : 'esbuild',
      // produce sourcemaps for debug builds
      sourcemap: !!process.env.TAURI_DEBUG,
      chunkSizeWarningLimit: 2000,
    },

    optimizeDeps: {
      exclude: [
        "@browsermt/bergamot-translator"
      ],
      needsInterop: [
        "@mlc-ai/web-tokenizers"
      ]
    },

    resolve: {
      alias: {
        'src': '/src',
        'modules': '/modules'
      }
    },
    worker: {
      format: 'es'
    }
  }
});
