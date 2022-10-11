const CACHE_NAME_CORE='CACHE-V1';
const CACHE_FILES_CORE=[
    "src/css/app.css",
    "src/js/app.js",
    "src/images/icons/icon-144x144.png",
    "src/images/computer.jpg",
    "index.html",
    "post.html",
    "/"
];

const CACHE_NAME_DYNAMIC='dynamic-v1';

const CACHE_NAME_INMUTABLE='inmutable-v1';
const CACHE_FILES_INMUTABLE=[
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://code.getmdl.io/1.3.0/material.blue-pink.min.css",
    "https://code.getmdl.io/1.3.0/material.min.js",
    "https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxK.woff2",
    "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2",
    "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2",
    "https://unpkg.com/pwacompat"
]
    
self.addEventListener('install', (event)=>{
    const guardandoCache=caches.open(CACHE_NAME_CORE)
        .then (cache =>cache.addAll(CACHE_FILES_CORE))
        .catch(err=>console.error(err.message));
    const guardandoCacheInmutable=caches.open(CACHE_NAME_INMUTABLE)
        .then (cache =>cache.addAll(CACHE_FILES_INMUTABLE))
        .catch(err=>console.error(err.message));   
    self.skipWaiting();
    event.waitUntil(Promise.all([guardandoCache,guardandoCacheInmutable]));
});

self.addEventListener('activate', (event) => {
    // Eliminando caches obsoletos
    const obtenerCaches = caches.keys()
      .then(allCaches => allCaches.filter(cache => ![CACHE_NAME_CORE, CACHE_NAME_INMUTABLE, CACHE_NAME_DYNAMIC].includes(cache)).filter(cacheName => caches.delete(cacheName))) 
      .catch(err => console.error(err.message))
    console.info('[SW]: Cache limpiado exitosamente...');
    event.waitUntil(obtenerCaches);
  });
  

self.addEventListener('fetch',  (event)=>{
    if(!(event.request.url.indexOf('http') === 0)){
        return;
      }

      const cacheAyudaRed = caches.match(event.request)
        .then(page => page || fetch(event.request)
        .then(eventRequest => {
          return caches.open(CACHE_NAME_DYNAMIC).then(cache => {
            if (![].concat(CACHE_FILES_CORE,CACHE_FILES_INMUTABLE).indexOf(event.request.url) || eventRequest.type === 'opaque') {
              cache.put(event.request, eventRequest.clone())
            }
            return eventRequest;
          })
        }));
      event.respondWith(cacheAyudaRed);
    
    
    
});

self.addEventListener('sync',  (event)=>{
    console.log(event);
});

self.addEventListener('push',  (event)=>{
    console.error(event);
});

