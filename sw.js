self.addEventListener('install', (event)=>{
    //agregar al cache nuestros archivos
    console.log('Adicionando los archivos al cache');

    const ins=new Promise((resolve,reject)=>{
         try{
            setTimeout(()=>{
                const adicionandoMisArchivos='';
                const adocionarVariablesDinamicas='';
                console.log('Service worker instalado');
             resolve();
            },1000);
            self.skipWaiting();
         }catch(error){
            reject(error.message);
         }

    })
event.waitUntil(ins);
});

self.addEventListener('active', (event)=> {
    console.log('Archivos guadados');
  
});

self.addEventListener('fetch',  (event)=>{
    console.log('Service worker escuchando');
  
});

self.addEventListener('sync',  (event)=>{
    console.log(event);
});

self.addEventListener('push',  (event)=>{
    console.log(event);
});

