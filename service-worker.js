const CACHE = "gustavo-panel-pro-v7";
const STATIC_ASSETS = [
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./portrait-panel.png",
  "./tarjeta-jpg.jpg",
  "./gustavo-gutierrez.vcf",
  "./Gustavo_Gutierrez_CV_General.pdf",
  "./Gustavo_Gutierrez_CV_Coordinacion_Operativa.pdf",
  "./Gustavo_Gutierrez_CV_Administracion.pdf",
  "./Gustavo_Gutierrez_CV_Clinicas_Salud.pdf"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if(event.request.method !== "GET") return;

  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request,{cache:"no-store"})
        .then(response => {
          if(response && response.ok){
            const copy=response.clone();
            caches.open(CACHE).then(cache => cache.put("./index.html",copy));
          }
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      const network=fetch(event.request).then(response => {
        if(response && response.ok){
          const copy=response.clone();
          caches.open(CACHE).then(cache => cache.put(event.request,copy));
        }
        return response;
      }).catch(() => cached);
      return cached || network;
    })
  );
});