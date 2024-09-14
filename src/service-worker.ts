/// <reference types="@sveltejs/kit" />
/// <reference lib="webworker" />
/// <reference types="svelte" />

import { build, files, version } from '$service-worker';

declare let self: ServiceWorkerGlobalScope;

const CACHE = `cache-${version}`;

const ASSETS = [
	...build,
	...files,
]

//Call Install Event
self.addEventListener('install', (e) => {
	console.log('%cService Worker: Installed', 'color: blue');
	async function addFilesToCache() {
		const cache = await caches.open(CACHE);
		await cache.addAll(ASSETS);
	}

	e.waitUntil(addFilesToCache());
});

//remove previous cached data from disk
async function deleteOldCache() {
	for (const key of await caches.keys()) {
		if (key !== CACHE) await caches.delete(key);
	}
}

function base64UrlToArrayBuffer(base64Url: string) {
	const padding = '='.repeat((4 - base64Url.length % 4) % 4); // Add padding if missing
	const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/') + padding; // Convert Base64URL to Base64
	const binary_string = atob(base64);
	const len = binary_string.length;
	const bytes = new Uint8Array(len);
	for (let i = 0; i < len; i++) {
		bytes[i] = binary_string.charCodeAt(i);
	}
	return bytes.buffer;
}


//Call Activate Event
self.addEventListener('activate', async (e) => {
	console.log('%cService Worker: Activated', 'color: green');
	//remove old caches
	e.waitUntil(deleteOldCache());
});

self.addEventListener('push', async (e) => {
    console.log('Service Worker: Push Received: ', e.data?.text());
    if (!e.data) return;
    const parts = e.data.text().split('::');
	const date = parts[0];
	const data = parts[1];
    console.log('Service Worker: Push Received: ', data);
    
    self.registration.showNotification('AIUB - ' + date, {
        body: data,
        icon: './aiub.png',
    });

	sendMessage('notice', null);
});

self.addEventListener('notificationclick', (e) => {
    e.notification.close();  // Close the notification
    // open the app itself
	const urlToOpen = new URL(self.location.origin).href;

    // Open the URL in a new window or focus if it is already open
    e.waitUntil(
		self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // If the page is already open, focus it
            for (const element of clientList) {
				const client = element;
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise, open a new window
            if (self.clients.openWindow) {
            	return self.clients.openWindow(urlToOpen);
            }
        })
    );
});


// Public Key:
// BBwqk_aVSALofg9Is2HyjhpGqwUnYhqfnGXbjSIHm-yufTH8f6LziNt02RTj1iZc-XlVrZAIuyB4_vFY0oC6RmU

// Private Key:
// 7z75k9Cste-iJs2gcH4b8I5CNGVNtzZifnNC01h5J40

//Call Fetch Event
self.addEventListener('fetch', (e) => {
	//ignore POST requests
	if (e.request.method !== 'GET') return;

	async function respond() {
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
				// if url is foreign, don't cache
				if (url.origin !== location.origin) return response;
				cache.put(e.request, response.clone());
			}

			return response;
		} catch (err) {
			if (url.origin !== location.origin) {
				throw err;
			}
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
	if (e && e.data) {
		if (e.data.type === 'SKIP_WAITING') {
			console.log('%cService Worker: Updated', 'color: orange');
			self.skipWaiting();
		} else if (e.data.type === 'SUBSCRIBE') {
			const API_URL = e.data.api;
			// check push notification support
			if (!self.registration.showNotification) {
				console.log('Service Worker: Push Not Supported');
				return;
			}
			//check permission
			if (Notification.permission !== 'granted') {
				console.log('Service Worker: Push Not Permitted');
				return;
			}
			console.log('getting subscription');
			//get the public key from the server
			fetch(`${API_URL}/getkey`).then(res => res.json()).then(data => {
				console.log(`Got Public Key: ${data.publicKey}`);
				self.registration.pushManager.subscribe({
					userVisibleOnly: true,
					applicationServerKey: base64UrlToArrayBuffer(data.publicKey)
				}).then(sub => {
					fetch(`${API_URL}/subscribe`, {
						method: 'POST',
						body: JSON.stringify(sub),
						headers: {
							'content-type': 'application/json'
						}
					}).then(res => res.json()).then(() => {
						console.log('Subscribed');
						//postMessage to the client
						sendMessage('subscribed', null);
					}).catch(err => console.error(err));
				}).catch(err => console.error(err));

			}).catch(err => console.error(err));
		} else if (e.data.type === 'UNSUBSCRIBE') {
			const API_URL = e.data.api;
			self.registration.pushManager.getSubscription().then(sub => {
				if (sub) {
					sub.unsubscribe().then(() => {
						fetch(`${API_URL}/unsubscribe`, {
							method: 'POST',
							body: JSON.stringify(sub),
							headers: {
								'content-type': 'application/json'
							}
						}).then(res => res.json()).then(() => {
							console.log('Unsubscribed');
							//postMessage to the client
							sendMessage('unsubscribed', null);
						}).catch(err => console.error(err));
					}).catch(err => console.error(err));
				} else {
					console.log('No Subscription');
					sendMessage('unsubscribed', null);
				}
			}).catch(err => console.error(err));
		}
	}
});

async function sendMessage(type: string, msg: any): Promise<void> {
	try {
		const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
		clients.forEach(client => {
			// Post message to each client
			try {
				client.postMessage({ type, data: msg });
			} catch (error) {
				console.error("Failed to post message to client:", error);
			}
		});
	} catch (error_1) {
		console.error("Failed to match clients:", error_1);
	}
}
