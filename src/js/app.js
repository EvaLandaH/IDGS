/* Declaracion de variables globales */
let MAIN;
let MODAL_POST;
let BTN_SHOW_POST;
let BTN_CANCEL_POST;
let deferredPrompt;

// Funciones
const showPostModal = () => {
  MAIN.style.display = 'none';
  MODAL_POST.style.display = 'block';
  setTimeout(() => {
    MODAL_POST.style.transform = 'translateY(0)';
  }, 1);
};


const closePostModal = () => {
  MAIN.style.display = 'block';
  MODAL_POST.style.transform = 'translateY(100vh)';
};

const sendData = async (e) => {
  try {
    e.preventDefault();
    TITLE = document.querySelector('#title').value;
    DESCRIPTION = document.querySelector('#description').value;
    if (TITLE && DESCRIPTION) {
      const post = {
        title: TITLE,
        description: DESCRIPTION,
      }
      // Vamos a utilizar el SyncManager
      if (window.SyncManager) {
        // Grabar o armar nuestra logica
        const readySW = await navigator.serviceWorker.ready;
        await readySW.sync.register('new-post');
        post._id = new Date().toISOString();
        await DB_POUCH.put(post);
      } else {
        post.timestamp = firebase.firestore.FieldValue.serverTimestamp();
        await db.collection('posts').add(post);
      }
      const data = {
        message: 'Registro exitosamente almacenado',
        timeout: 5000
      };
      Message().MaterialSnackbar.showSnackbar(data);
    } else {
      const data = {
        message: 'Faltan campos por llenar',
        timeout: 1500
      };
      Message('error').MaterialSnackbar.showSnackbar(data);
    }
  } catch (error) {
    const data = {
      message: error.message,
      timeout: 1500
    };
    Message('error').MaterialSnackbar.showSnackbar(data);
  }
};






window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});


// Cuando se cargue todo nuestro DOM
window.addEventListener('load', async() => {
  MAIN = document.querySelector('#main');
  MODAL_POST = document.querySelector('#modal-post-section');
  BTN_SHOW_POST = document.querySelector('#btn-upload-post');
  BTN_SHOW_POST.addEventListener('click', showPostModal);
  BTN_CANCEL_POST = document.querySelector('#btn-post-cancel');
  BTN_CANCEL_POST.addEventListener('click', closePostModal)

await Notification.requestPermission();

if('serviceWorker' in navigator){
const response=await navigator.serviceWorker.register('sw.js');
if (response){
  const ready=await navigator.serviceWorker.ready;
  ready.showNotification('Hola usuario',{
    body:'Este mensaje sonara',
    vibrate:[200,100,200,100,200,100,200]
  })
 
}

}
// Agarrando el boton enviar post
const btnPostSubmit = document.querySelector('#btn-post-submit');
btnPostSubmit.addEventListener('click', (e) => sendData(e));

const bannerInstall = document.querySelector('#banner-install');
    bannerInstall.addEventListener('click', async () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        const response = await deferredPrompt.userChoice;
        if (response.outcome === 'dismissed') {
          console.error('El usuario cancelo la instalación');
        }
      }
    });


});