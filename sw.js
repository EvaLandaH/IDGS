self.addEventListener('install', (event)=>{
      console.log('Service worker instalado');
    
});

self.addEventListener('active', async (event)=>{
    console.log('Service worker activo');
  
});

self.addEventListener('fetch',  (event)=>{
    console.log('Service worker escuchando');
  
});