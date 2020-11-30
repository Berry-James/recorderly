// Imports
import { App } from './../components/App.js';
import { Auth } from '../components/Auth.js';
import { Random } from '../components/Random.js';
import { User } from '../components/User.js';
import anime from './../node_modules/animejs/lib/anime.es.js';

function homePageController(){
 
    let data = {
        Title: "Renovate your Record Collection",
        Subtext: "Recorderly helps you catalogue and curate your music collection in the digital realm",
        aboutTitle: "Recorderly is the avid music collector's dream.",
        aboutBody: `Leveraging the ever growing Discogs.com database, Recorderly provides an easy solution for managing your existing colllection of vinyl records, cassette tapes, CDs and even digital files.`,
        aboutEnd: "Start Collecting"
    }

    App.loadPage('Home', 'template-page-home', data, () => {

        // load background particles
        particlesJS.load('particles-js', 'assets/home.json', function() {
        });

        // randomise home page
        Random.generateRandomHome();

        const button = document.getElementById("see-more-btn");
        const homeWave = document.querySelector(".svg-wrapper");
        const homeText = document.querySelector(".main-text");
        
        // if signed in...
        if(Auth.authenticated) {
            // set title + body text to welcome back
            homeText.querySelector("h1").innerText = `Welcome Back ${User.email.split('@')[0].charAt(0).toUpperCase() + User.email.split('@')[0].slice(1)}!`;
            homeText.querySelector(".body-text").innerText = 'Your collection is waiting to be expanded upon.';
            // get see more button, change redirect to #collection page
            const seeMore = homeText.querySelector('#see-more-btn');
            seeMore.innerText = 'My Collection';
            seeMore.addEventListener("click", () => {
                window.location.href = '#collection';
            });

        };

        // ANIM
        anime({
            targets: homeWave,
            keyframes: [
                { opacity: 0 },
                { opacity: 1  },
            ],
            delay: 200,
            easing: 'linear',
        });

        button.addEventListener("click", () => {
            // ANIM
            anime({
                targets: homeText,
                opacity: 0,
                translateX: '-100vw',
                easing: 'linear',
                duration: 400,
                complete: () => {
                    const h1 = homeText.querySelector("h1");
                    h1.innerText = data.aboutTitle;
                    h1.classList.add("about-title");
                    h1.classList.remove('main-title');
                    
                    homeText.querySelector("p").innerText = data.aboutBody;
                    homeText.querySelector("a").innerText = data.aboutEnd;
                    homeText.querySelector("a").addEventListener("click", () => {
                        window.location.href = '#search'
                    });
                    animate();
                },
            });

            function animate() {
                // animate home text on changeover
                anime({
                    targets: homeText,
                    opacity: 1,
                    translateX: '-0vw',
                    easing: 'linear',
                    duration: 400
                })
            };
        })

        // Run Wavify
        // ISSUE => Would prefer to use all vanilla JS but wavify is throwing GSAP error when using vanilla JS
        var myWave = $('#myID').wavify({
            height: 10,
            bones: 5,
            amplitude: 60,
            color: 'rgba(248, 185, 32, 1)',
            speed: .25
        });
    });
};


export { homePageController }