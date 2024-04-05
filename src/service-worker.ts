/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />

import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;

const ASSETS = [
	...build,
	...files,
]

//Call Install Event
self.addEventListener('install', (e) => {
	console.log('Service Worker: Installed');
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	e.waitUntil(addFilesToCache());
});

//Call Activate Event
self.addEventListener('activate', (e) => {
	//remove previous cached data from disk
	async function deleteOldCache() {
		for (const key of await caches.keys()) {
			if (key !== CACHE) await caches.delete(key);
		}
	}

	e.waitUntil(deleteOldCache());
});

//Call Fetch Event
self.addEventListener('fetch', (e) => {
	//ignore POST requests
	if (e.request.method !== 'GET') return;

	async function respond(){
		const url = new URL(e.request.url);
		const cache = await caches.open(CACHE);

		//`build`/`files` can always be served from the cache
		if (ASSETS.includes(url.pathname)) {
			const response = await cache.match(e.request);
			if (response) return response;
		}

		//for everything else, try the network first, then the cache
		//fallback to cache if offline
		try {
			const response = await fetch(e.request);

			// if we're offline, fetch can return a value that is not a Response
			// instead of throwing - and we can't pass this non-Response to respondWith
			if (!(response instanceof Response)) {
				throw new Error('invalid response from fetch');
			}

			if (response.status === 200) {
				cache.put(e.request, response.clone());
			}

			return response;
		} catch (err) {
			const response = await cache.match(e.request);

			if (response) {
				return response;
			}

			// if there's no cache, then just error out
			// as there is nothing we can do to respond to this request
			throw err;
		}
	}

	e.respondWith(respond());
});


self.addEventListener('message', (e) => {
	//console.log(e.data);
	if (e && e.data && e.data.type === 'SKIP_WAITING') {
		console.log('Service Worker: Updated');
		self.skipWaiting();
	}
});