import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { resolve } from 'path';

export default defineConfig({
	plugins: [svelte({ hot: !process.env.VITEST })],
	test: {
		include: ['src/**/*.component.test.{js,ts}'],
		environment: 'jsdom',
		setupFiles: ['src/test/setup.ts'],
		environmentOptions: {
			jsdom: {
				resources: 'usable'
			}
		},
		globals: true,
		// Ensure we're running in client-side mode for component tests
		pool: 'forks',
		poolOptions: {
			forks: {
				singleFork: true
			}
		}
	},
	resolve: {
		alias: {
			$lib: resolve(__dirname, 'src/lib'),
			$app: resolve(__dirname, 'src/app')
		}
	}
});
