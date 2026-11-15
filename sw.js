// Service Worker — Suivi Heures Pro
// Chemins RELATIFS : le site est servi depuis /HEURE-TRAVAIL/ sur GitHub Pages.
// Changer CACHE_NAME à chaque mise en ligne pour forcer la mise à jour.
const CACHE_NAME = 'hours-tracker-v4';
const urlsToCache = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './responsive-handler.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            // cache: 'reload' : ne pas recopier une vieille version du cache HTTP
            .then(cache => cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' }))))
            .then(() => self.skipWaiting())
    );
});

// Supprimer les anciens caches et prendre le contrôle tout de suite
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

// Réseau d'abord (pour toujours avoir la dernière version), cache si hors ligne
self.addEventListener('fetch', event => {
    const request = event.request;
    if (request.method !== 'GET') return;

    const url = new URL(request.url);
    const sameOrigin = url.origin === self.location.origin;
    const isFont = url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';
    if (!sameOrigin && !isFont) return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        try {
            // Fichiers du site : toujours revalider auprès du serveur (304 si inchangé)
            const response = await fetch(sameOrigin ? new Request(request, { cache: 'no-cache' }) : request);
            if (response && (response.ok || response.type === 'opaque')) {
                cache.put(request, response.clone()).catch(() => {});
            }
            return response;
        } catch (error) {
            const cached = await cache.match(request, { ignoreSearch: true });
            if (cached) return cached;
            if (request.mode === 'navigate') {
                const page = await cache.match('./index.html');
                if (page) return page;
            }
            return new Response('Hors ligne', { status: 503, statusText: 'Offline' });
        }
    })());
});
