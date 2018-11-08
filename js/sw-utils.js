
// Actualizamos el cache dinamico, recibe el nombre del cache, la peticion y la respuesta
function actualizarCacheDinamico(  dynamicCache  ,  request  ,  respuesta  ) {
    
    // Si la respuesta lo ha obtenido correctamente
    if(  respuesta.ok  ) {
        // Abrimos el cache dinamico
        caches.open(dynamicCache)
            .then(cache => {
                // Obtenido el cache dinamico, le cambiamos el viejo request por la nueva respuesta
                cache.put( request , respuesta.clone());
                // y retornamos la respuesta                
                return respuesta.clone();
            });
    } else {
        return respuesta;
    }
}