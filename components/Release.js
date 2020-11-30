import { Modal } from "./Modal.js";
import { Notify } from "./Notify.js";
import { Collection } from "./Collection.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Auth } from "./Auth.js";
import { Wishlist } from "./Wishlist.js";

const Release = {

    id: null,
    results: null,
    search: [],
    pageCount: 1,
     
    get: () => {
        // set page count to 1
        Release.pageCount = 1;
        // return new promise
        return new Promise((resolve, reject) => {
        // fetch master release from API based on search bar text
            fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&type=master&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL&page=1`)
            .then(res => res.json())
            .then(releases => {
                resolve(releases.results);
                Release.results = releases.results;
            })

            .catch(err => {
                reject(err);
            });

        // get next page button and alter classes
        let nextPageBtn = document.querySelector("#nextPage");
        nextPageBtn.classList.remove("nextPage-hide");
        nextPageBtn.classList.add("nextPage-show");
    });      
    },

    // GET NEXT PAGE
    getNextPage: () => {
        // add 1 to page counter
        Release.pageCount ++
        // return new promise
        return new Promise((resolve, reject) => {
        // fetch master releases from discogs API with a page count starting (effectively) at 2
            fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&type=master&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL&page=${Release.pageCount}`)
                .then(res => res.json())
                .then(releases => {
                    resolve(releases.results);
                })

            .catch(err => {
                reject(err);
            })
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
    
    // CREATE RELEASE OBJECT
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

    // SHOW MODAL
    showModal: (releaseObj) => {
        // get modal template
        const modalTemplate = document.querySelector('#template-release-modal').innerHTML;
        // render modal content with mustache
        const modalContent = Mustache.render(modalTemplate, releaseObj.data);
        // show modal
        Modal.show(modalContent);

        // add event listener if release name is too long
        const rName = document.querySelector(".release_artist");
        // if text length is over 20, add event listener to show full title on click/tap
        if(rName.innerText.length == 20) {
            rName.addEventListener("click", () => {
                Notify.show(releaseObj.data.title);
            })
        }

        // 'show more' functionality
        // get show more btn
        let showMoreBtn = document.querySelector("#release-more-info-btn");
        // get show more pannel (hidden)
        let moreInfoPanel = document.querySelector(".release-modal-more-info");
        // toggle '.hidden'
        showMoreBtn.addEventListener("click", () => {
            moreInfoPanel.classList.toggle('hidden');

            // ANIM
            anime({
                targets: moreInfoPanel,
                opacity: 1,
                duration: 5000,
                translateX: '0px'
            }) 
        });
     
        // get collection btn
        const collectionBtn = document.querySelector('#addToCollectionBtn');
        // create itag and span
        collectionBtn.itag = collectionBtn.querySelector("i");
        collectionBtn.span = collectionBtn.querySelector("span");
        // get wish list button and create accompanying span and i
        const wishlistBtn = document.querySelector("#addToWishlistBtn");
        wishlistBtn.itag = wishlistBtn.querySelector("i");
        wishlistBtn.span = wishlistBtn.querySelector("span");

        // DETERMINE COLLECTION BUTTON STATE
        // if user is signed in AND has release in collection, change button text
        if (Auth.authenticated) {
            let userId = localStorage.getItem('userId');
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}`)
            .then(res => res.json())
            .then(data => {
                // create empy collection + wish list arrays
                let collectionArray = [];
                let wishlistArray = [];

                // Get user collection from user_collection array generated in collection page controller
                data.user_collection.forEach(element => {
                    // if element is collection object
                    if(!element.collectionObj.id){
                    } else {
                        // push ID to array
                        collectionArray.push(element.collectionObj.id)
                    }
                });

                // Get user wish list from wishlist array generated in wishlist page controller
                data.wishlist.forEach(element => {
                    // if element is wishObj
                    if(!element.wishObj.id){
                    } else {
                        // push ID to array
                        wishlistArray.push(element.wishObj.id);
                    }
                }); 

                // if authenticated and array does not include current releases' ID
                if(Auth.authenticated && collectionArray.indexOf(releaseObj.data.id) === -1) {
                    // change btn i to plus
                    collectionBtn.itag.className = 'fas fa-plus';
                    // change innerText
                    collectionBtn.span.innerText = 'Collection';
                    // add event listener to add item to collection and then remove modal
                    collectionBtn.addEventListener("click", () => {
                        Collection.add();
                        Modal.remove();
                    });
                } 
                
                // if authenticated and wishlist does not contain current releases' ID
                if(Auth.authenticated && wishlistArray.indexOf(releaseObj.data.id) === -1) {
                    // change btn i to heart
                    wishlistBtn.itag.className = 'fas fa-heart';
                    // change innerText to 'Wishlist'
                    wishlistBtn.span.innerText = 'Wishlist';
                    // add click listener to add item to wish list and remove modal
                    wishlistBtn.addEventListener("click", () => {
                        Wishlist.add();
                        Modal.remove();
                    });
                };

                // if authenticated and wishlist array contains current release ID
                if(Auth.authenticated && wishlistArray.includes(releaseObj.data.id)) {
                    // change i to tick
                    wishlistBtn.itag.className = 'fas fa-check';
                    // set data val for bulma tooltip, change class to make tooltip active
                    wishlistBtn.setAttribute("data-tooltip", "Release already in wish list")
                    wishlistBtn.classList.add("has-tooltip-active", "has-tooltip-bottom");
                    // remove innerText of span
                    wishlistBtn.querySelector("span").innerText = null;
                    // add listener to remove item from wish list
                    collectionBtn.addEventListener("click", () => {
                        Wishlist.remove(releaseObj);
                    });
                };
                
                // if authenticated and collection includes release item
                if(Auth.authenticated && collectionArray.includes(releaseObj.data.id)) {
                    // change i to check icon
                    collectionBtn.itag.className = 'fas fa-check';
                    // set data val for bulma tooltip, change class to make tooltip active
                    collectionBtn.setAttribute("data-tooltip", "Release already in collection");
                    collectionBtn.classList.add("has-tooltip-active", "has-tooltip-bottom");
                    // remove innerText of span
                    collectionBtn.span.innerText = null;
                    collectionBtn.itag.style.margin = '0 auto';
                    // hide wish list button
                    wishlistBtn.style.display = 'none';

                    // change window location to collection on click
                    collectionBtn.addEventListener("click", () => {
                        window.location.href = '#collection';
                    });
                }; 
            });

            // set collection button id to the id of current release
            collectionBtn.setAttribute("id", releaseObj.data.id);

        // finally, if not authenticated
        } else if (!Auth.authenticated) {
            // get collection button
            const collectionBtn = document.querySelector("#addToCollectionBtn");
            // change button inner text to 'please sign in'
            collectionBtn.querySelector("span").innerText = 'Please Sign in';
            collectionBtn.querySelector("i").classList.add("fas", "fa-sign-in-alt");
            // hide wish list button
            wishlistBtn.style.display = 'none';
            // on click of collection button, redirect to sign in page
            collectionBtn.addEventListener("click", () => {
                window.location.href = "#signIn";
            })
        };

        // get format dropdown
        const formatDropdown = document.querySelector('#format-dropdown');
        // add listener to option change
        formatDropdown.addEventListener("change", () => {
            
            const formatDropdownInner = document.querySelector('#format-dropdown');
            // get release format image tag
            let formatImg = document.querySelector("#release-format");
            // get selected option
            let formatSelected = formatDropdownInner.options[formatDropdownInner.selectedIndex].value;
            // depending on type of format, chage class of image
            if(formatSelected === 'Cassette' || formatSelected === 'Digital Files'){
                formatImg.className = 'release-image-format-slide';
            };

            if(formatSelected === 'Vinyl' || formatSelected === 'Compact Disc'){
                formatImg.className = 'release-image-format';
            };
            // change image source to selected attribute
            formatImg.setAttribute("src", `./imgs/formats/${formatSelected}.svg`)
        }); 

    },    
}

export { Release }
