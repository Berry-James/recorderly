import { App } from "./App.js";
import anime from './../node_modules/animejs/lib/anime.es.js';

const Tutorial = {

    showCloseBtn: true,
    show: (content) => {
        // create overlay div
        let tutorialOverlay = document.createElement('div');
        tutorialOverlay.className = 'tutorial-overlay';
        //append to rootEl
        App.rootEL.appendChild(tutorialOverlay);
        // create modalDiv
        let tutorialDiv = document.createElement('div');
        tutorialDiv.className = 'tutorialDiv';

        // create ModalContent
        let tutorialContent = document.createElement('div');
        tutorialContent.classname = 'tutorial-content';

        // create p tag
        const text = document.createElement("p");
        // set inner text to parsed content
        text.innerText = content;
        // append p tag
        tutorialContent.appendChild(text);
        // append modalContent to modalDiv
        tutorialDiv.appendChild(tutorialContent);
        // append modalDiv to rootEl
        App.rootEL.appendChild(tutorialDiv);


        // ANIM
        anime({
            targets: tutorialDiv, 
            keyframes: [
                { opacity: 0, top: '65%', duration: 0, easing: 'easeOutCubic' },
                { opacity: 1, top: '10%', left: '12%', duration: 500, easing: 'easeOutCubic' }
            ]
        })

        // add esc key press function to trigger Modal.remove()
        Tutorial.tutorialEscKey = (e) => {
            if(e.keyCode == 27){
                console.log("esc key!");
                Tutorial.remove();
            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Tutorial.tutorialEscKey);
    },

    remove: () => {
        // get overlayDiv
        let overlayDiv = document.querySelector('.tutorial-overlay');
        // get modalDiv
        let tutorialDiv = document.querySelector('.tutorialDiv');

        // if tutorial div does not exist, do nothing
        if(tutorialDiv == null){

        // if tutorialdiv does exist...
        }else{
            // entrance ANIM
            anime({
                targets: overlayDiv,
                opacity: 0,
                duration: 100, 
                easing: 'linear',
                complete: () => {
                    if(overlayDiv) {
                        overlayDiv.remove();
                    }
                }
            });

            // exit ANIM
            anime({
                targets: tutorialDiv,
                opacity: 0,
                duration: 100, 
                top: '20%',
                easing:  'spring',
                complete: () => {
                    tutorialDiv.remove();
                }
            });
        }

        // stop listening for esc key
        document.removeEventListener('keydown', Tutorial.tutorialEscKey);
    }
}

export { Tutorial }