import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Release } from "./Release.js";
import { Modal } from "./Modal.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { App } from "./App.js";


const Wishlist = {

    add: () => {
        let userId = localStorage.getItem('userId');
        let releaseId = document.querySelector('.cart-btn').getAttribute("id");
        let formatDropdown = document.querySelector('#format-dropdown');
        let format = formatDropdown.options[formatDropdown.selectedIndex].text;
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(wishObj => {
                resolve(wishObj);

                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete wishObj[e]);

                return new Promise((resolve, reject) => {
                 fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_wishlist/`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                wishObj,
                                format      
                        })
                    })
                    .then(Notify.show(`📀 <b>${wishObj.title}</b> added to Wishlist!`))
                })
                .catch(err => {
                    console.log(err);
                })
            })
        })
    }, 
    
    remove: (data) => {
        let releaseId = data.data.id; 
        let userId = localStorage.getItem('userId');
        let format = document.querySelector("#format-options").innerText;
 
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(wishObj => {
                resolve(wishObj);
                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete wishObj[e]);
                return new Promise((resolve, reject) => {
                    fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_wishlist/delete`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                wishObj,
                                format 
                        })
                    })
                    .then(Notify.show(`✅ <b>${wishObj.title}</b> removed from wishlist!`));
                    Wishlist.getUserWishlist();
                })
                .catch(err => {
                    reject(err);
                })
            })
        })
        .catch(err => {
            reject(err)
        })
    }, 

    search: () => {
        let collectionItems = document.querySelectorAll('.release-entry');
        let searchBar = document.querySelector(".searchInput")
        collectionItems.forEach(item => {
            let name = item.querySelector('.release-title').innerText.toLowerCase();
            
            if(!name.includes(searchBar.value.toLowerCase())) {
                item.style.display = 'none';
            }else{
                item.style.display = 'flex';
            }
        })
    },
    
    getUserWishlist: () => {
        let userID = localStorage.getItem('userId')
        return new Promise((resolve, reject) => {
            let loader = document.createElement("img");
            loader.className = "loading-icon";
            loader.setAttribute("src", "./imgs/svg/loader-main.svg");
            App.rootEL.appendChild(loader);
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${userID}`)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                App.rootEL.removeChild(loader);
            })
            .catch(err => {
                reject(err);
            })
        })
    },

    createWishObj: (item) => {
        // create empty object
        const wishObj = {};
        // set data from parameter
        wishObj.data = item;
        // get template HTML
        wishObj.template = document.querySelector('#template-collection-entry').innerHTML;
        // create div element
        wishObj.el = document.createElement('div');
        // render()
        wishObj.render = () => {
            // set div class name
            wishObj.el.className = 'release-entry';
            // set release id to data.id
            wishObj.el.setAttribute('id', `release-${wishObj.data.id}`);
            // render HTML using mustache template
            wishObj.el.innerHTML = Mustache.render(wishObj.template, wishObj.data);
            // run events()
            wishObj.events();
        }
        // events()
        wishObj.events = () => {
            // get view-release-btn
            const viewReleaseBtn = wishObj.el.querySelector('.release-image');
            viewReleaseBtn.addEventListener('click', () => {
                Wishlist.showModal(wishObj);
            });
        }
        // run render()
        wishObj.render();
        // return the object
        return wishObj;
    },

    showModal: (wishObj) => {
        // get modal template
        const modalTemplate = document.querySelector('#template-wishlist-modal').innerHTML;
        // render modal content with mustache
        const modalContent = Mustache.render(modalTemplate, wishObj.data);
        // show modal
        Modal.show(modalContent);

        // ITEM REMOVE
        const removeBtn = document.querySelector("#removeFromWishlistBtn")
        removeBtn.addEventListener("click", () => {
            wishObj.el.style.display = 'none';
            Wishlist.remove(wishObj);
            Modal.remove();
        });

        // show more button listener
        let showMoreBtn = document.querySelector("#release-more-info-btn");
        let moreInfoPanel = document.querySelector(".release-modal-more-info");
        showMoreBtn.addEventListener("click", () => {
            moreInfoPanel.classList.toggle('hidden');
            anime({
                targets: moreInfoPanel,
                opacity: 1,
                duration: 1
            })
            
        })

        
        let imgType = document.querySelector("#release-format")

        if(wishObj.data.userFormat == 'Digital Files'){
           imgType.classList.add('release-image-format-slide');
           imgType.classList.remove('release-image-format');
        }if(wishObj.data.userFormat == 'Cassette'){
            imgType.classList.add('release-image-format-slide');
            imgType.classList.remove('release-image-format');
         }
    },
}

export { Wishlist }

