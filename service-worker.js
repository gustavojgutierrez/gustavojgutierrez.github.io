const CACHE="gustavo-panel-pro-b7-12-native";
const ASSETS=[
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./apple-touch-icon.png",
  "./panel-ui-approved.png",
  "./tarjeta-jpg.jpg",
  "./portrait-original.jpg",
  "./gustavo-gutierrez.vcf",
  "./Gustavo_Gutierrez_CV_General.pdf",
  "./Gustavo_Gutierrez_CV_Coordinacion_Operativa.pdf",
  "./Gustavo_Gutierrez_CV_Administracion.pdf",
  "./Gustavo_Gutierrez_CV_Clinicas_Salud.pdf"
];

self.addEventListener("install",e=>{
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener("activate",e=>{
  e.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET") return;

  if(e.request.mode==="navigate"){
    e.respondWith(
      fetch(e.request,{cache:"no-store"})
        .then(r=>{
          if(r&&r.ok){
            const copy=r.clone();
            caches.open(CACHE).then(c=>c.put("./index.html",copy));
          }
          return r;
        })
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(cached=>{
      const net=fetch(e.request).then(r=>{
        if(r&&r.ok){
          const copy=r.clone();
          caches.open(CACHE).then(c=>c.put(e.request,copy));
        }
        return r;
      }).catch(()=>cached);
      return cached||net;
    })
  );
});