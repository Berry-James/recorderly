// Imports
import { App } from '../components/App.js';
import { Release } from '../components/Release.js';
import { Notify } from '../components/Notify.js';
import { User } from '../components/User.js';
import { Collection } from '../components/Collection.js';
import { Auth } from '../components/Auth.js';
import { Filters } from '../components/Filters.js';
import { Modal } from '../components/Modal.js';
import anime from './../node_modules/animejs/lib/anime.es.js';



function collectionPageController(){
    let data = {
        title: ''
    } 
    
    let userName = `${User.email.split('@')[0]}'sasdfasdf`;
    let suffix = ' Collection';
    if(userName.length > 10) {
        let newName = userName.substr(0, 7);
        newName += '...';
        newName += suffix;
        data.title = newName;
    } else {
        userName += suffix;
        data.title = userName;
        console.log(data.title + ' fits');

    }
    App.loadPage('Collection', 'template-page-cart', data, () =>{




               

        let filterBtn = document.querySelector("#filters-btn");
        let QRBtn = document.querySelector("#QRBtn");

        QRBtn.addEventListener("click", function(){
            let id = localStorage.getItem("userId");
            let QRModalContent = document.querySelector("#template-QR-modal").innerHTML;
            Modal.show(QRModalContent);
            let QRSource = document.querySelector("#QRSource");
            let QRURL = document.querySelector("#QRURL");
            QRURL.setAttribute("href", `${window.location.origin}/index.html#?user=${id}`)
            QRURL.addEventListener("click", () => {
                
            })
            QRSource.setAttribute("src", `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/index.html#?user=${id}`)
        })

        // SEARCH COLLECTION
        let searchBar = document.querySelector('.searchInput');
        searchBar.addEventListener("keydown", function(event) {
            if (event.keyCode == 13) {
                Collection.search() 
            }
        })

        function generateUserCollection(){
            let releaseDiv = document.querySelector(".release-container");
            releaseDiv.innerHTML = null;

            let formats = ['Vinyl', 'Cassette', 'CD', 'Digital']

            formats.forEach(format => {
                let container = document.createElement("div");
                container.className = format.toLowerCase() + '-container';
                let heading = document.createElement('h4');
                heading.innerText = format;
                let divider = document.createElement("hr");
                let textContainer = document.createElement('div');
                textContainer.className = 'text-container';
                textContainer.appendChild(heading);
                textContainer.appendChild(divider);
                container.appendChild(textContainer);
                releaseDiv.appendChild(container);
            })

            return new Promise(() => {
                Collection.getUserCollection()
                .then(releases => {
                    releases.user_collection.forEach(release => {
                        release.collectionObj.userFormat = release.format;
                        let collectionItem = Collection.createCollectionObj(release.collectionObj);
    
                        // CONTAINERS
                        let vinylContainer = document.querySelector(".vinyl-container");
                        let cdContainer = document.querySelector(".cd-container");
                        let cassetteContainer = document.querySelector(".cassette-container");
                        let digitalContainer = document.querySelector(".digital-container");
    
                        if(release.format == 'Vinyl') {
                            vinylContainer.style.display = "flex"
                            vinylContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(vinylContainer);
                        }
                        if(release.format == 'Compact Disc'){
                            cdContainer.style.display = "flex"
                            cdContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(cdContainer);    
                        }
                        if(release.format == 'Cassette'){
                            cassetteContainer.style.display = "flex"
                            cassetteContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(cassetteContainer);    
                        }
                        if(release.format == 'Digital Files'){
                            digitalContainer.style.display = "flex"
                            digitalContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(digitalContainer);    
                        }   
    
                        let releasesToAnimate = document.querySelectorAll(".release-entry");         
                        anime({
                            targets: releasesToAnimate,
                            keyframes: [
                                { opacity: 0, translateY: '15px'},
                                { opacity: 1, translateY: '0px'},
                            ],
                            easing: 'easeOutElastic(1, .6)',
                            delay: anime.stagger(100, {easing: 'linear'})
                        }); 
    
                    })
                })
            })    
        

        }
        
        generateUserCollection();

    });


}

export { collectionPageController }