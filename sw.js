//imports
importScripts("./js/sw-utils.js");




const CACHE_STATIC = "static-v2";
const CACHE_DINAMIC = "dinamic-v1";
const CACHE_INMUTABLE = "INMUTABLE-v1";





// El corazon de nuestra aplicacion
const APP_SHELL = [
    //"/",
    "index.html",
    "./js/app.js",
    "./css/style.css",
    "./img/avatars/hulk.jpg",
    "./img/avatars/ironman.jpg",
    "./img/avatars/spiderman.jpg",
    "./img/avatars/thor.jpg",
    "./img/avatars/wolverine.jpg",
    "./img/favicon.ico",
];

const APP_SHELL_INMUTABLE = [
    "https://fonts.googleapis.com/css?family=Quicksand:300,400",
    "https://fonts.googleapis.com/css?family=Lato:400,300",
    "./css/animate.css",
    "https://use.fontawesome.com/releases/v5.3.1/css/all.css",
    "./js/libs/jquery.js",
];





self.addEventListener('install', evento => {

    const cacheStatic = caches.open( CACHE_STATIC )
        .then(cache => cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( CACHE_INMUTABLE )
        .then(cache => cache.addAll( APP_SHELL_INMUTABLE ));

    evento.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', evento => {
    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(  key != CACHE_STATIC  &&  key.includes("static")) {
                    return caches.delete(key);
                } 
            });
        });
    
    evento.waitUntil(respuesta);
});



self.addEventListener('fetch', evento => {
    
    const respuesta = caches.match( evento.request )
        .then( res => {
            if (res) {
                return res;
            } else {
                return fetch(evento.request)
                    .then(nuevaRespuesta => actualizarCacheDinamico(CACHE_DINAMIC, evento.request, nuevaRespuesta))
            }
        });
});