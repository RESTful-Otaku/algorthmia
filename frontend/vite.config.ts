import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	server: {
		port: 5173,
		host: true
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
