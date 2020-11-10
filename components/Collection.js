import { User } from "./User.js";
import { Notify } from "./Notify.js";
import { Release } from "./Release.js";
import { Modal } from "./Modal.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { App } from "./App.js";


const Collection = {

    add: () => {
        let userId = localStorage.getItem('userId');
        let releaseId = document.querySelector('.cart-btn').getAttribute("id");
        let formatDropdown = document.querySelector('#format-dropdown');
        let format = formatDropdown.options[formatDropdown.selectedIndex].text;
        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(collectionObj => {
                resolve(collectionObj);

                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete collectionObj[e]);

                return new Promise((resolve, reject) => {
                    fetch(`http://recorderly-backend.herokuapp.com/api/users/${userId}`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                collectionObj,
                                format      
                        })
                    })
                    .then(Notify.show(`📀 <b>${collectionObj.title}</b> added to collection!`))
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
            .then(collectionObj => {
                resolve(collectionObj);
                // STRIP USELESS INFO
                const strip = ['data_quality', 'lowest_price', 'most_recent_release', 'most_recent_release_url', 'num_for_sale', 'resource_url', 'versions_url', 'videos', 'notes', 'main_release_url'];
                strip.forEach(e => delete collectionObj[e]);
                return new Promise((resolve, reject) => {
                    fetch(`http://recorderly-backend.herokuapp.com/api/users/${userId}/user_collection/delete`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                collectionObj,
                                format 
                        })
                    })
                    .then(Notify.show(`✅ <b>${collectionObj.title}</b> removed from collection!`))
                    Collection.getUserCollection();
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
/*                 item.style.opacity = '0';
                item.style.animation = 'collectionFadeIn 0.5s linear';
                item.style.animationfillmode = 'forwards'; */
            }
        })
    },
    
    getUserCollection: () => {
        let userID = localStorage.getItem('userId')
        return new Promise((resolve, reject) => {
            let loader = document.createElement("img");
            loader.className = "loading-icon";
            loader.setAttribute("src", "./imgs/svg/loader-main.svg");
            App.rootEL.appendChild(loader);
            fetch(`http://recorderly-backend.herokuapp.com/api/users/${userID}`)
            .then(console.log(`getting collection ID = ${userID}`))
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

    getSpecifiedCollection: (id) => {
        return new Promise((resolve, reject) => {
            fetch(`http://recorderly-backend.herokuapp.com/api/users/${id}`)
            .then(console.log(`getting collection ID = ${id}`))
            .then(res => res.json())
            .then(releases => {
                resolve(releases);
                console.log(releases);
                
            })
            .catch(err => {
                reject(err);
            })
        })

    },

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

        // ITEM REMOVE
        const removeBtn = document.querySelector("#removeFromCollectionBtn")
        removeBtn.addEventListener("click", () => {
            collectionObj.el.style.display = 'none';
            Collection.remove(collectionObj);
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

