// Imports
import { App } from '../components/App.js';
import { Release } from '../components/Release.js';
import { Notify } from '../components/Notify.js';
import { User } from '../components/User.js';
import { Collection } from '../components/Collection.js';
import { Auth } from '../components/Auth.js';
import { Filters } from '../components/Filters.js';
import { Intersection } from '../components/Intersection.js';
import anime from './../node_modules/animejs/lib/anime.es.js';



function specifiedCollectionPageController(){
    let data = {
        title: ''
    } 

    App.loadPage('Collection', 'template-page-specifiedCollection', data, () =>{

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

            let id = window.location.href.split('=')[1];
            
            Collection.getSpecifiedCollection(id)            
            .then(releases => {
                let userName = releases.email.split('@')[0];
                const userField = document.querySelector("#user-specific");
                userField.querySelector("span").innerText = `${userName}'s Collection`;
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

                    let releaseThings = document.querySelectorAll(".release-entry");
                    releaseThings.forEach(release => {
                        Intersection.releases(release);
                    })      

                })
            })
        }
        
        generateUserCollection();

    });
}

export { specifiedCollectionPageController }