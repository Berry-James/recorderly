import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Modal } from "./Modal.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Loader } from "./Loader.js";


const Wishlist = {

    // store wish list data locally when needed for filtering
    local: [],

    // ADD RELEASE TO WISH LIST
    add: () => {
        // get user ID from local token
        let userId = localStorage.getItem('userId');
        // get signed-in user ID from #ID
        let releaseId = document.querySelector('.cart-btn').getAttribute("id");
        // get dropdown selector and chosen format from dropdown box
        let formatDropdown = document.querySelector('#format-dropdown');
        let format = formatDropdown.options[formatDropdown.selectedIndex].text;

        // fetch specified release via Discogs API
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(wishObj => {
                resolve(wishObj);

                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete wishObj[e]);

                // fetch user's wish list and PUT new release
                return new Promise((resolve, reject) => {
                 fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_wishlist/`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                wishObj,
                                format      
                        })
                    })
                    // show notification
                    .then(Notify.show(`💝 <b>${wishObj.title}</b> added to Wishlist!`))
                    // add 1 to wish list count
                    User.wishCount++;
                })
                .catch(err => {
                    console.log(err);
                })
            })
        })
    }, 
    
    // REMOVE ITEM FROM WISH LIST
    remove: (data) => {
        // get release ID from parsed data
        let releaseId = data.data.id; 
        // get user ID from local token
        let userId = localStorage.getItem('userId');
        // get chosen format from innerText of #format-options
        let format = document.querySelector("#format-options").innerText;
 
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(wishObj => {
                resolve(wishObj);
                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete wishObj[e]);
                // PUT release to add + chosen format to delete endpoint
                return new Promise((resolve, reject) => {
                    fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_wishlist/delete`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            wishObj,
                            format 
                        })
                    })
                    // Show notification
                    .then(Notify.show(`✅ <b>${wishObj.title}</b> removed from wishlist!`));
                    User.wishCount--;
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

    // SEARCH FUNCTION
    search: () => {
        // get all wish list items
        let collectionItems = document.querySelectorAll('.release-entry');
        let searchBar = document.querySelector(".searchInput")
        collectionItems.forEach(item => {
            // to lower case
            let name = item.querySelector('.release-title').innerText.toLowerCase();

            // hide items where name != search value
            if(!name.includes(searchBar.value.toLowerCase())) {
                item.style.display = 'none';
            }else{
                item.style.display = 'flex';
            }
        });
    },
    
    // GET USER WISH LIST
    getUserWishlist: () => {
        // get current user ID from token
        let userID = localStorage.getItem('userId')
        return new Promise((resolve, reject) => {
            // show loader
            Loader.show('Fetching your wish list...')
            // fetch collection via backend API
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${userID}`)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                // remove loader
                Loader.remove();
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

        // change class for format depending on release type (spin/slide)
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

