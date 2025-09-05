import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		host: true,
		proxy: {
			'/api': {
				target: 'http://localhost:8080',
				changeOrigin: true,
				secure: false
			}
		}
	},
	build: {
		target: 'esnext',
		minify: 'esbuild',
		sourcemap: false,
		chunkSizeWarningLimit: 1000
	},
	optimizeDeps: {
		include: ['lucide-svelte', 'clsx', 'tailwind-merge']
	}
});
