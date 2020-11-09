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
            .then(collectionObj => {
                resolve(collectionObj);
                return new Promise((resolve, reject) => {
                    fetch(`http://localhost:8081/api/users/${userId}`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                collectionObj,
                                format
                        })
                    })
                    .then(Notify.show(`📀 <b>${collectionObj.title}</b> added to wish list!`))
                })
            })
        })
    }, 
    
    remove: () => {
        let userId = localStorage.getItem('userId');
        let releaseId = document.querySelector('.collection-btn').getAttribute("id");
        let format = document.querySelector("#format-options").innerText;

        return new Promise((resolve, reject) => {
            fetch(`https://api.discogs.com/masters/${releaseId}?Authorization=Discogs&key=eGHyyNaoLKebhZmFQYNf&secret=AxUVWVBrFrIbUullTLmWbejTBIDLiGpQ`)
            .then(res => res.json())
            .then(collectionObj => {
                resolve(collectionObj);
                return new Promise((resolve, reject) => {
                    fetch(`http://localhost:8081/api/users/${userId}`, {
                        method: 'PUT',
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                                collectionObj,
                                format
                        })
                    })
                    .then(Notify.show(`<b>${collectionObj.title}</b> added to collection!`))
                })
            })
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
            fetch(`http://localhost:8081/api/users/${userID}`)
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
            fetch(`http://localhost:8081/api/users/${id}`)
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

        /* DELETE TESTING HERE */
/*         let removeBtn = document.querySelector(".collection-btn");
        removeBtn.setAttribute("id", collectionObj.data.id);
        removeBtn.addEventListener("click", () => {
            Collection.remove();
        }) */

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

export { Wishlist }

