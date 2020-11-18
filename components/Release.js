import { App } from "./App.js";
import { Modal } from "./Modal.js";
import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Collection } from "./Collection.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Auth } from "./Auth.js";
import { Wishlist } from "./Wishlist.js";

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
        })
        .catch(err => {
            reject(err);
        })
        pageCounter ++
    });      

    },


    getReleaseById: () => {
        return new Promise((resolve, reject) => {
            let url = new URL(`https://recorderly-backend.herokuapp.com/api/users`);
            let params = { ids: ids };
            url.search = new URLSearchParams(params).toString();
            
            fetch(url)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
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
            let title = releaseObj.data.title;
            let split = title.split(' - ');

            if(split[1].length > 20) {
                let newTitle = split[1].substr(0, 17);
                newTitle += '...';
                releaseObj.data.releaseName = newTitle;
            } else {
                let split = title.split(' - ');
                releaseObj.data.releaseName = split[1];
            }
            releaseObj.data.artistName = split[0];



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

        // add event listener if release name is too long
        const rName = document.querySelector(".release_artist");
        if(rName.innerText.length == 20) {
            rName.addEventListener("click", () => {
                Notify.show(releaseObj.data.title);
            })
        }



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
        collectionBtn.itag = collectionBtn.querySelector("i");
        collectionBtn.span = collectionBtn.querySelector("span");
        const wishlistBtn = document.querySelector("#addToWishlistBtn");
        wishlistBtn.itag = wishlistBtn.querySelector("i");
        wishlistBtn.span = wishlistBtn.querySelector("span");

        // get wishlist button
        // DETERMINE COLLECTION BUTTON STATE
        // if user is signed in AND has release in collection, change button text
        if(Auth.authenticated){
            let userId = localStorage.getItem('userId');
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                let collectionArray = [];
                let wishlistArray = [];

                // Get user collection from user_collection array generated in collection page controller
                data.user_collection.forEach(element => {
                    if(!element.collectionObj.id){
                    } else {
                        collectionArray.push(element.collectionObj.id)
                    }
                })

                data.wishlist.forEach(element => {
                    if(!element.wishObj.id){
                    } else {
                        wishlistArray.push(element.wishObj.id);
                    }
                }); 

                if(Auth.authenticated && collectionArray.indexOf(releaseObj.data.id) === -1) {
                    collectionBtn.itag.className = 'fas fa-plus';
                    collectionBtn.span.innerText = 'Collection';
                    collectionBtn.addEventListener("click", () => {
                        Collection.add();
                        Modal.remove();
                    });
                } 
                
                if(Auth.authenticated && wishlistArray.indexOf(releaseObj.data.id) === -1) {
                    wishlistBtn.span.innerText = 'Wishlist';
                    wishlistBtn.itag.className = 'fas fa-heart';
                    wishlistBtn.addEventListener("click", () => {
                        Wishlist.add();
                        Modal.remove();
                    });
                };

                if(Auth.authenticated && wishlistArray.includes(releaseObj.data.id)) {
                    wishlistBtn.itag.className = 'fas fa-check';
                    wishlistBtn.setAttribute("data-tooltip", "Release already in wish list")
                    wishlistBtn.classList.add("has-tooltip-active", "has-tooltip-bottom");
                    wishlistBtn.
                    collectionBtn.addEventListener("click", () => {
                        Wishlist.remove(releaseObj);
                    });
                };
                
                if(Auth.authenticated && collectionArray.includes(releaseObj.data.id)) {
                    collectionBtn.itag.className = 'fas fa-check';
                    collectionBtn.setAttribute("data-tooltip", "Release already in collection");
                    collectionBtn.span.innerText = null;
                    collectionBtn.classList.add("has-tooltip-active", "has-tooltip-bottom");
                    collectionBtn.itag.style.margin = '0 auto';
                    wishlistBtn.style.display = 'none';

                    collectionBtn.addEventListener("click", () => {
                        window.location.href = '#collection';
                    });
                } 

/*                 else if(!Auth.authenticated) {
                    collectionBtn.itag.className = 'fas fa-sign-in-alt';
                    collectionBtn.span.innerText = 'Please sign in';
                    wishlistBtn.style.display = 'none';
                }; */
            })
        collectionBtn.setAttribute("id", releaseObj.data.id);

        } else if(!Auth.authenticated) {
            const collectionBtn = document.querySelector("#addToCollectionBtn");
            collectionBtn.querySelector("span").innerText = 'Please Sign in';
            collectionBtn.querySelector("i").classList.add("fas", "fa-sign-in-alt");
            wishlistBtn.style.display = 'none';
            collectionBtn.addEventListener("click", () => {
                window.location.href = "#signIn";
            })
        }


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
