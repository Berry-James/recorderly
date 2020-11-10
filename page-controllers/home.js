// Imports
import { App } from './../components/App.js';
import { Notify } from '../components/Notify.js';
import { Modal } from '../components/Modal.js';
import { Auth } from '../components/Auth.js';
import { Burger } from '../components/Burger.js';
import { Random } from '../components/Random.js';
import { Collection } from '../components/Collection.js';
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

        particlesJS.load('particles-js', 'assets/home.json', function() {
          });

        Random.generateRandomHome();
        
        let imgArray = ["imgs/svg/turntable2.svg", "imgs/svg/record-stack.svg", "imgs/svg/casette.svg"]
        let mainImg = document.querySelector("#main-img-id");
        let button = document.getElementById("see-more-btn")    
        let homeWave = document.querySelector(".svg-wrapper")
        const homeText = document.querySelector(".main-text");

        if(Auth.authenticated) {
            homeText.querySelector("h1").innerText = `Welcome Back ${User.email.split('@')[0].charAt(0).toUpperCase() + User.email.split('@')[0].slice(1)}!`;
            homeText.querySelector(".body-text").innerText = 'Your collection is waiting to be expanded upon.';
            const seeMore = homeText.querySelector('#see-more-btn');
            seeMore.innerText = 'My Collection';
            seeMore.addEventListener("click", () => {
                window.location.href = '#collection';
            })

        }



        anime({
            targets: homeWave,
            keyframes: [
                { opacity: 0 },
                { opacity: 1  },
            ],
            delay: 200,
            easing: 'linear',
        });


/* 
        searchBar.addEventListener("click", function() {
            location.hash = "#search";
        }) */


        function imgChange() {                
            anime({
            targets: mainImg, 
            keyframes: [
                { opacity: 0, duration: 0, easing: 'easeOutCubic' },
                { opacity: 1, duration: 500, easing: 'easeOutCubic' }
            ]
            })
        }

        

        button.addEventListener("click", function(){cool()})
            function cool() {
                const homePage = document.querySelector('.main-text');
                const aboutPage = document.querySelector('.more-info-text');
                const wave = document.querySelector(".home-wave");

                anime({
                    targets: homePage,
                    opacity: 0,
                    translateX: '-100vw',
                    easing: 'linear',
                    duration: 400,
                    complete: () => {
                        const h1 = homePage.querySelector("h1");
                        h1.innerText = data.aboutTitle;
                        h1.classList.add("about-title");
                        h1.classList.remove('main-title');
                        
                        homePage.querySelector("p").innerText = data.aboutBody;
                        homePage.querySelector("a").innerText = data.aboutEnd;
                        homePage.querySelector("a").addEventListener("click", () => {
                            window.location.href = '#search'
                        })
                        animate();
                    },
                })

                function animate() {
                    anime({
                        targets: homePage,
                        opacity: 1,
                        translateX: '-0vw',
                        easing: 'linear',
                        duration: 400
                    })
                }
            }

        // Run Wavify function
        var myWave = $('#myID').wavify({
            height: 10,
            bones: 5,
            amplitude: 60,
            color: 'rgba(248, 185, 32, 1)',
            speed: .25
        });

        

        imgChange();
    });
    

}


export { homePageController }