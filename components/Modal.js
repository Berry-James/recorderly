import { App } from "./App.js";
import anime from './../node_modules/animejs/lib/anime.es.js';

const Modal = {
    showCloseBtn: true,
    show: (content) => {
        // create overlay div
        let overlayDiv = document.createElement('div');
        overlayDiv.className = 'modal-overlay';
        //append to rootEl
        App.rootEL.appendChild(overlayDiv);
        // create modalDiv
        let modalDiv = document.createElement('div');
        modalDiv.className = 'myModal';
        // create ModalContent
        let modalContent = document.createElement('div');
        modalContent.classname = 'modal-content';
        // insert content
        modalContent.innerHTML = content;
        // create modalCloseBtn
        let modalCloseBtn = document.createElement('a');
        modalCloseBtn.className = 'modal-close-btn';
        modalCloseBtn.innerHTML = '&times;';
        // append modalContent to modalDiv
        modalDiv.appendChild(modalContent);
        // if showClosebtn = true, append modalCloseBtn too
        if(Modal.showCloseBtn === true){
            modalDiv.appendChild(modalCloseBtn);
        }
        // append modalDiv to rootEl
        App.rootEL.appendChild(modalDiv);
        // ANIM
        anime({
            targets: modalDiv, 
            keyframes: [
                { opacity: 0, top: '65%', duration: 0, easing: 'easeOutCubic' },
                { opacity: 1, top: '52%', duration: 500, easing: 'easeOutCubic' }
                
            ]
        })
        // add event listener to modalCloseBtn
        modalCloseBtn.addEventListener('click', (e) => {
            Modal.remove();
        });
        // add esc key press function to trigger Modal.remove()
        Modal.modalEscKey = (e) => {
            if(e.keyCode == 27){
                Modal.remove();
            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Modal.modalEscKey);
    },

    remove: () => {
        // get overlayDiv
        let overlayDiv = document.querySelector('.modal-overlay');
        // get modalDiv
        let modalDiv = document.querySelector('.myModal');
        anime({
            targets: overlayDiv,
            opacity: 0,
            duration: 100, 
            easing: 'linear',
            delay: 100,
            complete: () => {
                overlayDiv.remove();
            }
        })
        // modalDiv exit animation
         anime({
            targets: modalDiv,
            opacity: 0,
            duration: 100, 
            top: '20%',
            easing:  'linear',
            complete: () => {
                modalDiv.remove();
            }
        }); 
        
        
        // stop listening for esc key
        document.removeEventListener('keydown', Modal.modalEscKey);
    }
}

export { Modal }