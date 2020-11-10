import { App } from "./App.js";
import { Modal } from "./Modal.js";
import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Collection } from "./Collection.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Auth } from "./Auth.js";

let pageCounter = 2

const Release = {

    id: null,
    results: null,
    
    get: () => {
        // return new promise
        return new Promise((resolve, reject) => {
        // fetch master release from API based on search bar text
        fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&type=master&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL`)
        .then(res => res.json())
        .then(releases => {
            resolve(releases.results);
            Release.results = releases.results;
            
        })
        .catch(err => {
            reject(err);
        })
        let nextPageBtn = document.querySelector("#nextPage");
        nextPageBtn.classList.remove("nextPage-hide");
        nextPageBtn.classList.add("nextPage-show");
    });      
    },

    getNextPage: () => {
        
        // return new promise
        return new Promise((resolve, reject) => {
        // fetch master releases from discogs API but also add page count parameter (starting at 2)
        fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL&page=${pageCounter}`)
        .then(res => res.json())
        .then(releases => {
            resolve(releases.results);
            console.log(releases.results);
        })
        .catch(err => {
            reject(err);
        })
        pageCounter ++
        console.log(pageCounter);
    });      

    },


    getReleaseById: () => {
        return new Promise((resolve, reject) => {
            let url = new URL(`http://recorderly-backend.herokuapp.com/api/users`);
            let params = { ids: ids };
            url.search = new URLSearchParams(params).toString();
            
            fetch(url)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                console.log(url);
            })
            .catch(err => {
                reject(err);
            })
        });
    },
    

    createReleaseObj: (data) => {
        // create empty object
        const releaseObj = {};
        // set data from parameter
        releaseObj.data = data;
        // get template HTML
        releaseObj.template = document.querySelector('#template-release-entry').innerHTML;
        // create div element
        releaseObj.el = document.createElement('div');

        // render()
        releaseObj.render = () => {
            // set div class name
            releaseObj.el.className = 'release-entry';
            // set release id to data.id
            releaseObj.el.setAttribute('id', `${releaseObj.data.id}`);

            // set release ARTIST to artist name (string split);
            let title = releaseObj.data.title.toString();
            let split = title.split(' - ');
            releaseObj.data.artistName = split[0];
            releaseObj.data.releaseName = split[1];

            // set external Discogs URL
            let URI = releaseObj.data.uri;
            let URL = `https://www.discogs.com${URI}`
            releaseObj.data.discogsURL = URL;

            // render HTML using mustache template
            releaseObj.el.innerHTML = Mustache.render(releaseObj.template, releaseObj.data);
            // run events()
            releaseObj.events();
        }

        // events()
        releaseObj.events = () => {
            // get view-release-btn
            const viewReleaseBtn = releaseObj.el.querySelector('.release-image');
            const releaseContent = releaseObj.el.querySelector('.content');
            viewReleaseBtn.addEventListener('click', () => {
                Release.showModal(releaseObj);
            });
            releaseContent.addEventListener('click', () => {
                Release.showModal(releaseObj);
            });
        }

        // run render()
       releaseObj.render();
 
        // return the object
        return releaseObj;
    },

    showModal: (releaseObj) => {
        // get modal template
        const modalTemplate = document.querySelector('#template-release-modal').innerHTML;
        // render modal content with mustache
        const modalContent = Mustache.render(modalTemplate, releaseObj.data);
        // show modal
        Modal.show(modalContent);



        // show more button listener
        let showMoreBtn = document.querySelector("#release-more-info-btn");
        let moreInfoPanel = document.querySelector(".release-modal-more-info");
        showMoreBtn.addEventListener("click", () => {
            moreInfoPanel.classList.toggle('hidden');
            anime({
                targets: moreInfoPanel,
                opacity: 1,
                duration: 5000,
                translateX: '0px'
            })
            
        })

        // ITEM REMOVE
        const removeBtn = document.querySelector("#removeFromCollectionBtn")

        
        // get collection btn
        const collectionBtn = document.querySelector('#addToCollectionBtn');
        // DETERMINE COLLECTION BUTTON STATE
        // if user is signed in AND has release in collection, change button text\
         let userId = localStorage.getItem('userId');
            fetch(`http://recorderly-backend.herokuapp.com/api/users/${userId}`)
            .then(res => res.json())
            .then(collection => {
                let collectionArray = []
                collection.user_collection.forEach(element => {
                    collectionArray.push(element.collectionObj.id)
                })
                console.log(releaseObj.data.id);
                if(Auth.authenticated && collectionArray.indexOf(releaseObj.data.id) === -1) {
                    collectionBtn.innerText = 'Add to Collection'
                    collectionBtn.addEventListener("click", function collectionAdd() {
                        Collection.add();
                        Modal.remove();
                    })
                } else if(!Auth.authenticated) {
                    collectionBtn.innerText = 'Sign in to add to collection'
                } else {
                    collectionBtn.innerText = 'View in Collection'
                    collectionBtn.addEventListener("click", () => {
                        window.location.href = '#collection';
                    })
                }
            })
/*         if(Auth.authenticated && App.user_collection.indexOf(releaseObj.data.id) === -1) {
            collectionBtn.innerText = 'Add to Collection';
        } else if(!Auth.authenticated) {
            collectionBtn.innerText = 'Sign in and add to collection'
        }
        else {
            collectionBtn.innerText = 'Remove from Collection';
        }  */

        collectionBtn.setAttribute("id", releaseObj.data.id);

/*         // click event
         collectionBtn.addEventListener('click', () => {
            Collection.getUserCollection();
            // if user is signed in AND release is NOT in collection...
            if(Auth.authenticated == true && App.user_collection.indexOf(releaseObj.data.id) === -1){
                // Add release to collection
                Collection.add();
                // Change button text
                collectionBtn.innerText = 'Remove from Collection';
                // if App.user_collection DOES NOT include the release ID, add it to the array
                if(App.user_collection.indexOf(releaseObj.data.id) === -1) {
                    App.user_collection.push(releaseObj.data.id);
                }
            // if the user collection DOES include the release...
            }else if(App.user_collection.includes(releaseObj.data.id)) {
                Notify.show('Release already in collection');
            }
            
            else {
                Notify.show('Please Sign in before adding items to your collection')
                window.location.href="#signIn";
            }
        });  */

        let formatDropdown = document.querySelector('#format-dropdown');
        formatDropdown.addEventListener("change", () => {

            let formatDropdownInner = document.querySelector('#format-dropdown');

            let formatImg = document.querySelector("#release-format");
            let formatSelected = formatDropdownInner.options[formatDropdownInner.selectedIndex].value;
            if(formatSelected === 'Cassette' || formatSelected === 'Digital Files'){
                formatImg.className = 'release-image-format-slide';
            }

            if(formatSelected === 'Vinyl' || formatSelected === 'Compact Disc'){
                formatImg.className = 'release-image-format';
            }

            formatImg.setAttribute("src", `./imgs/formats/${formatSelected}.svg`)
        }) 

    },


    
}

export { Release }
