const CACHE_NAME = 'hours-tracker-v2';
const urlsToCache = [
    '/',
    '/index.html',
    '/style.css',
    '/app.js',
    '/manifest.json',
    '/icon-192.png',
    '/icon-512.png'
];

// Cache-first strategy with background update
const cacheFirst = async (request) => {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
        // Return cached response and update cache in background
        updateCache(request);
        return cachedResponse;
    }
    return updateCache(request);
};

// Update cache and return network response
const updateCache = async (request) => {
    const cache = await caches.open(CACHE_NAME);
    try {
        const response = await fetch(request);
        if (response.ok) {
            await cache.put(request, response.clone());
        }
        return response;
    } catch (error) {
        return new Response('Offline content not available', {
            status: 404,
            statusText: 'Not Found'
        });
    }
};

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(cacheFirst(event.request));
});