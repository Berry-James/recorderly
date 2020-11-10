import { App } from "./App.js";
import { Auth } from "./Auth.js";
import { Modal } from "./Modal.js";
import { User } from "./User.js";
import anime from './../node_modules/animejs/lib/anime.es.js';

const Burger = {
    showCloseBtn: true,
    active: false,

    show: (content) => {
        // set burger status to active
        Burger.active = true;

        let hamburgerBtn = document.querySelector("#hamburger");

        // create overlay div
        let burgerOverlay = document.createElement('div');
        burgerOverlay.className = 'burger-overlay';
        // append to rootEl
        App.rootEL.appendChild(burgerOverlay);
        // create modalDiv
        let burgerDiv = document.createElement('div');
        burgerDiv.className = 'burger-div';
        // create ModalContent
        let burgerContent = document.createElement('div');
        burgerContent.classname = 'burger-content';
        // insert content
        burgerContent.innerHTML = content;
        // create header w/title
        let burgerHeader = document.createElement('div');
        burgerHeader.className = 'burger-header'
        burgerHeader.innerHTML = '<h1>Navigation</h1>'

        // create profile icon+ sign in status
        const profile = document.createElement("div");
        const profileImg = document.createElement("img");
        const profileText = document.createElement("h2");
        if(Auth.authenticated) {
            profileText.innerText = `Signed in as ${User.email.split('@')[0].charAt(0).toUpperCase() + User.email.split('@')[0].slice(1)}`;
        }
        profileImg.src="./imgs/svg/casette.svg";
        profileText.className= "profile-text"
        profile.className = "profile-container";
        profileImg.className = "profile-img";
        profile.appendChild(profileImg);
        profile.appendChild(profileText);

        // append modalContent to modalDiv
        burgerDiv.appendChild(burgerHeader);
        if (Auth.authenticated===true){
            burgerDiv.appendChild(profile);
        }
        burgerDiv.appendChild(burgerContent);
        
        // append modalDiv to rootEl
        App.rootEL.appendChild(burgerDiv);
        
        // ANIM
         anime({
            targets: burgerDiv, 
            keyframes: [
                { opacity: 0, right: '-20%' },
                { opacity: 1, right: '0%' } 
            ],
            duration: 400,
            easing: 'linear',
        }) 

        const burgerBtn = document.querySelector("#hamburger");
        burgerBtn.classList.add("burger-rotate");



        // modal overlay click event listener
        burgerOverlay.addEventListener("click", (e) => {
            Burger.remove();
            hamburgerBtn.style.display = "flex";

        });

        let aboutBtn = document.querySelector("#about-btn");
        let aboutContent = document.querySelector("#template-about-modal").innerHTML;
        aboutBtn.addEventListener("click", function() {
            Modal.show(aboutContent)
        })

        let helpBtn = document.querySelector("#help-btn");
        let helpContent = document.querySelector("#template-help-modal").innerHTML;
        helpBtn.addEventListener("click", function() {
            Modal.show(helpContent)
        })

        let signBtn = document.getElementById("signInBtn-burger");
        
        if(Auth.authenticated) {
            signBtn.innerText = 'Sign Out';
            signBtn.href = "#signOut";
            
        }else if(!Auth.authenticated) {
            signBtn.innerText = 'Sign In';
            signBtn.href="#signIn";
        }

        // add esc key press function to trigger Modal.remove()
        Burger.burgerEscKey = (e) => {
            if(e.keyCode == 27){
                console.log("esc key!");
                Burger.remove();
                hamburgerBtn.style.display = "flex";

            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Burger.burgerEscKey);
    },

    remove: () => {
        Burger.active = false;
        // get overlayDiv
        let burgerOverlay = document.querySelector('.burger-overlay');
        // get modalDiv
        let burgerDiv = document.querySelector('.burger-div');
        anime({
            targets: burgerOverlay, opacity: 0, duration: 100,  easing: 'linear', complete: () => {
                burgerOverlay.remove();
            }
        })
        // modalDiv exit animation
        anime({
            targets: burgerDiv,
            opacity: 0,
            duration: 100, 
            right: '-20%',
            easing:  'linear',
            complete: () => {
                burgerDiv.remove();
            }
        });
        const burgerBtn = document.querySelector("#hamburger");
        burgerBtn.classList.remove("burger-rotate");


        // stop listening for esc key
        document.removeEventListener('keydown', Burger.burgerEscKey);
        
    }
}

export { Burger }