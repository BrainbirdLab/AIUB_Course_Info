import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import pkg from './package.json' assert { type: 'json' };

export default defineConfig({
	plugins: [sveltekit()],
	define: {
		__VERSION__: JSON.stringify(pkg.version.replace(/^v/, ''))
	},
});
