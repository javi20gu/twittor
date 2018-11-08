// importamos la funcion
importScripts("./js/sw-utils.js");


// Definimos las versiones del cache
const CACHE_STATIC = "static-v2";
const CACHE_DINAMIC = "dinamic-v1";
const CACHE_INMUTABLE = "INMUTABLE-v1";





// Definimos lo que tendra el cache
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
    
    // En la instalación agregamos al cache las rutas
    const cacheStatic = caches.open( CACHE_STATIC )
        .then(cache => cache.addAll( APP_SHELL ));

    const cacheInmutable = caches.open( CACHE_INMUTABLE )
        .then(cache => cache.addAll( APP_SHELL_INMUTABLE ));

    // Esperamos hasta que se complete
    evento.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});


self.addEventListener('activate', evento => {
    
    // Obtenemos todos los nombres de las caches en clave - valor
    const respuesta = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if(  key != CACHE_STATIC  &&  key.includes("static")  ) {
                    // Eliminamos las versiones antiguas del cache si el cache es diferente de la version actual del cache y incluye la palabra static
                    return caches.delete(key);
                } 
            });
        });

    // Esperamos hasta que se complete
    evento.waitUntil(respuesta);
});



self.addEventListener('fetch', evento => {
    
    // Dentro de todas las caches que tenemos, nos retorna si existe en el cache esa request
    const respuesta = caches.match( evento.request )
        .then( resonp => {

            // Si existe la request en el cache
            if (resonp) {
                return resonp;
            } else {
                // Si no lo encuentra en el cache, lo extrae desde internet
                return fetch(evento.request)
                    .then(nuevaRespuesta => actualizarCacheDinamico(CACHE_DINAMIC, evento.request, nuevaRespuesta));
            }
        });
});