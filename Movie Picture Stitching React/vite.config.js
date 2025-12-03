import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
    base: './',
    build: {
        outDir: 'dist',
        sourcemap: false,
        minify: true,
        rollupOptions: {
            output: {
                manualChunks: undefined, // Keep single bundle for Eagle plugin
                assetFileNames: 'assets/[name]-[hash][extname]',
                chunkFileNames: 'assets/[name]-[hash].js',
                entryFileNames: 'assets/[name]-[hash].js',
            },
        },
    },
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/components'),
            '@hooks': path.resolve(__dirname, './src/hooks'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@styles': path.resolve(__dirname, './src/styles'),
        },
    },
    server: {
        port: 5173,
        open: true,
    },
});
