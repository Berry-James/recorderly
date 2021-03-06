import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Modal } from "./Modal.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Loader } from "./Loader.js";


const Collection = {

    // Store current collection locally for filtering
    local: [],

    // ADDING RELEASE TO COLLECTION
    add: () => {
        // Get signed-in user ID from localStorage token
        let userId = localStorage.getItem('userId');
        // Get database ID of release from its #ID
        let releaseId = document.querySelector('.cart-btn').getAttribute("id");
        // Get dropdown selector and chosen format from dropdown box
        let formatDropdown = document.querySelector('#format-dropdown');
        let format = formatDropdown.options[formatDropdown.selectedIndex].text;

        // Fetch specified release via Discogs API
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(collectionObj => {
                resolve(collectionObj);

                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(val => delete collectionObj[val]);

                // Fetch user's collection and PUT new release
                return new Promise((resolve, reject) => {
                    fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_collection/`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                collectionObj,
                                format      
                        })
                    })
                    // Show notification
                    .then(Notify.show(`📀 <b>${collectionObj.title}</b> added to collection!`));
                    // Add 1 to collection count
                    User.collectionCount++;
                })
                .catch(err => {
                    reject(err);
                });
            });
        });
    }, 

    // REMOVE ITEM FROM COLLECTION
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
            .then(collectionObj => {
                resolve(collectionObj);

                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete collectionObj[e]);
                
                // PUT collection object and format to delete endpoint
                return new Promise((resolve, reject) => {
                    fetch(`https://recorderly-backend.herokuapp.com/api/users/${userId}/user_collection/delete`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            collectionObj,
                            format 
                        })
                    })
                    // Show 'deleted' notification
                    .then(Notify.show(`✅ <b>${collectionObj.title}</b> removed from collection!`));
                    // Remove this release from local collection
                    Collection.local.filter((data) => {
                        return data.data.id != data.data.id
                    })
                    User.collectionCount--;

                })
                .catch(err => {
                    reject(err);
                });
            })
        })
        .catch(err => {
            reject(err)
        });
    }, 

    // SEARCH FUNCTION
    search: () => {
        // get all collection items
        let collectionItems = document.querySelectorAll('.release-entry');
        let searchBar = document.querySelector(".searchInput")
        collectionItems.forEach(item => {
            // get lower case title for each release
            let name = item.querySelector('.release-title').innerText.toLowerCase();

            // hide items not found in search query
            if(!name.includes(searchBar.value.toLowerCase())) {
                item.style.display = 'none';
            }else{
                item.style.display = 'flex';
            }
        })
    },
    
    // GET USER COLLECTION
    getUserCollection: () => {
        // get current user ID from token
        let userID = localStorage.getItem('userId')
        // fetch collection via backend API
        return new Promise((resolve, reject) => {
            // Display loader
            Loader.show('Fetching your collection...')
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${userID}`)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                // remove loader
                Loader.remove();
                // clear local collection
                Collection.local = [];
                // push each fetched release into local collection
                releases.user_collection.forEach(release => {
                    Collection.local.push(release);
                })
            })
            .catch(err => {
                reject(err);
            })
        })
    },

    // GET SPECIFIED USER COLLECTION
    getSpecifiedCollection: (id) => {
        return new Promise((resolve, reject) => {
            fetch(`https://recorderly-backend.herokuapp.com/api/users/${id}`)
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                
            })
            .catch(err => {
                reject(err);
            })
        })

    },

    // CREATE RELEASE OBJECT
    createCollectionObj: (item) => {
        // create empty object
        const collectionObj = {};
        // set data from parameter
        collectionObj.data = item;
        // get template HTML
        collectionObj.template = document.querySelector('#template-collection-entry').innerHTML;
        // create div element
        collectionObj.el = document.createElement('div');
        // render()
        collectionObj.render = () => {
            // set div class name
            collectionObj.el.className = 'release-entry';
            // set release id to data.id
            collectionObj.el.setAttribute('id', `release-${collectionObj.data.id}`);
            // render HTML using mustache template
            collectionObj.el.innerHTML = Mustache.render(collectionObj.template, collectionObj.data);
            // run events()
            collectionObj.events();
        }
        // events()
        collectionObj.events = () => {
            // get view-release-btn
            const viewReleaseBtn = collectionObj.el.querySelector('.release-image');
            viewReleaseBtn.addEventListener('click', () => {
                Collection.showModal(collectionObj);
            });
        }
        // run render()
        collectionObj.render();
        // return the object
        return collectionObj;
    },

    showModal: (collectionObj) => {
        // get modal template
        const modalTemplate = document.querySelector('#template-collection-modal').innerHTML;
        // render modal content with mustache
        const modalContent = Mustache.render(modalTemplate, collectionObj.data);
        // show modal
        Modal.show(modalContent);
        
        // remove 'remove' btn if not on own collection
        if(window.location.hash != '#collection') {
            const removeBtn = document.querySelector("#removeFromCollectionBtn");
            removeBtn.style.display = 'none';
        }

        // ITEM REMOVE
        const removeBtn = document.querySelector("#removeFromCollectionBtn")
        if(removeBtn) {
            removeBtn.addEventListener("click", () => {
                collectionObj.el.style.display = 'none';
                Collection.remove(collectionObj);
                User.collectionCount--;
                Modal.remove();
            });
        }


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

        // Change class for format depending on image (spin/slide)
        let imgType = document.querySelector("#release-format")
        if(collectionObj.data.userFormat == 'Digital Files'){
           imgType.classList.add('release-image-format-slide');
           imgType.classList.remove('release-image-format');
        }if(collectionObj.data.userFormat == 'Cassette'){
            imgType.classList.add('release-image-format-slide');
            imgType.classList.remove('release-image-format');
         }
    },
}

export { Collection }

