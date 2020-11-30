// Imports
import { App } from '../components/App.js';
import { User } from '../components/User.js';
import { Collection } from '../components/Collection.js';
import { Modal } from '../components/Modal.js';
import { Intersection } from '../components/Intersection.js';

function collectionPageController(){
    let data = {
        title: ''
    }; 

    // generate user name based on signed in user details
    let userName = `${User.email.split('@')[0]}`;
    const plural = "'s";
    let fullName = userName + plural;
    const suffix = ' Collection';
    
    // mobile (760px width or below)
    if(window.innerWidth <= 760 ) {
        if(userName.length > 10) {  
            // split username at 7th char
            let newName = userName.substr(0, 7);
            // append elipsis
            newName += '...';
            // append 's
            newName += plural;
            // append suffix
            newName += suffix;
            // set data.title to shortened name
            data.title = newName;
        } else {
            // append suffix to full-size name, set to data.title
            let newName = fullName;
            newName += suffix;
            data.title = newName;
        };

    // not mobile (screen is big enough to fit full name)
    } else {
        data.title = fullName;
    }

    // load page from template and data
    App.loadPage('Collection', 'template-page-cart', data, () =>{

        // get QR button
        const QRBtn = document.querySelector("#QRBtn");
        // ad QR button listener
        QRBtn.addEventListener("click", function(){
            // get user ID from token
            let id = localStorage.getItem("userId");
            // get QR template
            let QRModalContent = document.querySelector("#template-QR-modal").innerHTML;
            // show modal with QR template
            Modal.show(QRModalContent);
            // get QR code image
            let QRSource = document.querySelector("#QRSource");
            // get regular profile URL
            let QRURL = document.querySelector("#QRURL");
            // change redirect to to include user ID (alongside current page origin)
            QRURL.setAttribute("href", `${window.location.origin}/index.html#?user=${id}`);
            // set attribute of QR code to redirect address (BUG => FULL LINK IS BEING TRANSMITTED THROUGH QR CODE BUT BROWSER IS REDIRECTING TO HOME PAGE UPON SCAN)
            QRSource.setAttribute("src", `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${window.location.origin}/index.html#?user=${id}`);
        });

        // SEARCH COLLECTION
        let searchBar = document.querySelector('.searchInput');
        searchBar.addEventListener("keydown", function(event) {
            if (event.keyCode == 13) {
                Collection.search() 
            }
        })

        // GENERATE COLLECTION
        function generateUserCollection(){
            // get release container and clear it
            const releaseDiv = document.querySelector(".release-container");
            releaseDiv.innerHTML = null;

            // define formats
            const formats = ['Vinyl', 'Cassette', 'CD', 'Digital']

            // loop through formats and create containers for each
            formats.forEach(format => {
                const container = document.createElement("div");
                // set classname to format name
                container.className = format.toLowerCase() + '-container';
                // create heading and set inner text to the format
                const heading = document.createElement('h4');
                heading.innerText = format;
                // create HRs to divide sections
                const divider = document.createElement("hr");
                const textContainer = document.createElement('div');
                // create text container and append heading and divider to it
                textContainer.className = 'text-container';
                // append divider and title to text container
                textContainer.appendChild(heading);
                textContainer.appendChild(divider);
                // append text container to container
                container.appendChild(textContainer);
                // append to release div
                releaseDiv.appendChild(container);
            });

            // new promise
            return new Promise(() => {
                // get user collection
                Collection.getUserCollection()  
                .then(releases => {
                    // loop through releases and create objects for each
                    releases.user_collection.forEach(release => {
                        // set userFormat to fetched release.format
                        release.collectionObj.userFormat = release.format;
                        let collectionItem = Collection.createCollectionObj(release.collectionObj);
    
                        // get containers
                        const vinylContainer = document.querySelector(".vinyl-container");
                        const cdContainer = document.querySelector(".cd-container");
                        const cassetteContainer = document.querySelector(".cassette-container");
                        const digitalContainer = document.querySelector(".digital-container");

                        // if release exists in particular format, make the container visible and append the collection item (stops empty containers from being made)
                        // ISSUE => if user removes all items from a particular format, the container does not auto-disappear too
                        if(release.format == 'Vinyl') {
                            vinylContainer.style.display = "flex"
                            vinylContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(vinylContainer);
                        };
                        
                        if(release.format == 'Compact Disc'){
                            cdContainer.style.display = "flex"
                            cdContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(cdContainer);    
                        };

                        if(release.format == 'Cassette'){
                            cassetteContainer.style.display = "flex"
                            cassetteContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(cassetteContainer);    
                        };

                        if(release.format == 'Digital Files'){
                            digitalContainer.style.display = "flex"
                            digitalContainer.appendChild(collectionItem.el);
                            releaseDiv.appendChild(digitalContainer);    
                        };   

                        // observe all releases
                        let allReleases = document.querySelectorAll(".release-entry");
                        allReleases.forEach(release => {
                            Intersection.releases(release);
                        });         
    
                    });
                });
            });    
        

        };
        
        generateUserCollection();

    });


}

export { collectionPageController }