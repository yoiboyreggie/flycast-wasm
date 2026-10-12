/*! coi-serviceworker v0.1.7 | MIT License | https://github.com */
if (typeof window === 'undefined') {
    self.addEventListener('install', () => self.skipWaiting());
    self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
    self.addEventListener('fetch', event => {
        if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    if (response.status === 0) return response;
                    const newHeaders = new Headers(response.headers);
                    newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
                    newHeaders.set('Cross-Origin-Embedder-Policy', 'require-corp');
                    return new Response(response.body, {
                        status: response.status,
                        statusText: response.statusText,
                        headers: newHeaders
                    });
                })
                .catch(e => console.error(e))
        );
    });
} else {
    const currentScript = document.currentScript;
    const scriptSrc = currentScript ? currentScript.src : 'coi-serviceworker.js';
    navigator.serviceWorker.register(scriptSrc).then(registration => {
        registration.addEventListener('updatefound', () => {
            location.reload();
        });
        if (navigator.serviceWorker.controller) {
            console.log('COI Service Worker active.');
        } else {
            location.reload();
        }
    }).catch(err => {
        console.error('COI registration failed:', err);
    });
}
