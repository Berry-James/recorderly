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

        const hamburgerBtn = document.querySelector("#hamburger");

        // create overlay div
        const burgerOverlay = document.createElement('div');
        burgerOverlay.className = 'burger-overlay';
        // append to rootEl
        App.rootEL.appendChild(burgerOverlay);
        // create burgerDiv
        const burgerDiv = document.createElement('div');
        burgerDiv.className = 'burger-div';
        // create burgerContent
        const burgerContent = document.createElement('div');
        burgerContent.classname = 'burger-content';
        // insert content
        burgerContent.innerHTML = content;
        // create header w/title
        const burgerHeader = document.createElement('div');
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

        // append burgerContent to burgerDiv
        burgerDiv.appendChild(burgerHeader);
        if (Auth.authenticated===true){
            burgerDiv.appendChild(profile);
        }
        burgerDiv.appendChild(burgerContent);
        
        // append burgerDiv to rootEl
        App.rootEL.appendChild(burgerDiv);
        
        // ANIM
         anime({
            targets: burgerDiv, 
            right: '0%',
            duration: 150,
            easing: 'linear',
        }) 

        const burgerBtn = document.querySelector("#hamburger");
        burgerBtn.classList.add("burger-rotate");

        // Burger overlay click event listener
        burgerOverlay.addEventListener("click", (e) => {
            Burger.remove();
            hamburgerBtn.style.display = "flex";

        });

        const aboutBtn = document.querySelector("#about-btn");
        const aboutContent = document.querySelector("#template-about-modal").innerHTML;
        aboutBtn.addEventListener("click", function() {
            Modal.show(aboutContent);
            Burger.remove();
        });

        const helpBtn = document.querySelector("#help-btn");
        const helpContent = document.querySelector("#template-help-modal").innerHTML;
        helpBtn.addEventListener("click", function() {
            Modal.show(helpContent);
            Burger.remove();
        });

        const collection = document.querySelector("#burger-collection");
        const wishlist = document.querySelector("#burger-wishlist");

        if(!Auth.authenticated) {
            collection.style.display = 'none';
            wishlist.style.display = 'none';
        }

        // change button text and icon depending on auth status
        const signBtn = document.getElementById("signInBtn-burger");
        if(Auth.authenticated) {
            signBtn.querySelector("p").innerText = 'Sign Out';
            signBtn.querySelector("i").className = 'fas fa-sign-out-alt';
            signBtn.href = "#signOut";
            
        }else if(!Auth.authenticated) {
            signBtn.querySelector("p").innerText = 'Sign In';
            signBtn.querySelector("i").className = 'fas fa-sign-in-alt';
            signBtn.href="#signIn";
        };

        // add esc key press function to trigger Burger.remove()
        Burger.burgerEscKey = (e) => {
            if(e.keyCode == 27){
                Burger.remove();
                hamburgerBtn.style.display = "flex";

            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Burger.burgerEscKey);

        // BUTTON EVENTS
        const links = document.querySelectorAll(".burger-link");
        links.forEach(link => {
            link.onclick = () => {
                Burger.remove();
            }
        })
    },

    remove: () => {
        Burger.active = false;
        // get burger overlay
        const burgerOverlay = document.querySelector('.burger-overlay');
        // get burger
        const burgerDiv = document.querySelector('.burger-div');
        anime({
            targets: burgerOverlay,
            opacity: 0,
            easing: 'linear',
            duration: 100,
            complete: () => {
                burgerOverlay.remove();
            }
        });

        // burger exit animation
        anime({
            targets: burgerDiv,
            opacity: 0,
            duration: 100, 
            right: '-20%',
            easing:  'linear',
        });
        burgerDiv.remove();
        const burgerBtn = document.querySelector("#hamburger");
        burgerBtn.classList.remove("burger-rotate");

        // stop listening for esc key
        document.removeEventListener('keydown', Burger.burgerEscKey);
        
    }
}

export { Burger }