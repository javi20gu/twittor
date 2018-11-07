

function actualizarCacheDinamico(  dynamicCache  ,  request  ,  respuesta  ) {
    if(  respuesta.ok  ) {
        caches.open(dynamicCache)
            .then(cache => {
                cache.put( request , respuesta.clone());
                return respuesta.clone();
            });
    } else {
        return respuesta;
    }
}  