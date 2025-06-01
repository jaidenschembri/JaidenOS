import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		paths: {
			base: process.env.NODE_ENV === 'production' ? '/jaiden-os' : ''
		},
		prerender: {
			handleHttpError: ({ path, referrer, message }) => {
				// Ignore 404s for missing assets (images, icons, etc.)
				if (path.includes('favicon') || 
					path.includes('.png') || 
					path.includes('.ico') || 
					path.includes('.svg') ||
					path.includes('.jpg') ||
					path.includes('.jpeg') ||
					path.includes('/icons/')) {
					console.warn(`Ignoring missing asset: ${path}`);
					return;
				}
				throw new Error(message);
			}
		}
	}
};

export default config;
