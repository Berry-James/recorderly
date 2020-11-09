import { App } from "./App.js";
import { Release } from "./Release.js";
import anime from './../node_modules/animejs/lib/anime.es.js';

const Filters = {

    getInGenre: () => {
        const releaseDiv = document.getElementById("myData");
        let genreDropDown = document.getElementById("genreDropdown");
        let optionSelected = genreDropDown.options[genreDropDown.selectedIndex].text;
        Release.get()
        let releaseArray = Release.results.filter(function (e) {
            return e.genre[0] === optionSelected;
        });
        releaseDiv.innerHTML = null;
        releaseArray.forEach(release => {
            let slider = document.querySelector("#releaseSizeRange");
            slider.addEventListener("input",function()
            {
                releaseItem.el.style.width = `${slider.value}px`;
                releaseItem.el.style.height = `${slider.value}px`;               
            }) 
            releaseArray.push(release);
            let releaseItem = Release.createReleaseObj(release);
            releaseDiv.appendChild(releaseItem.el);
        });
        let releaseThings = document.querySelectorAll(".release-entry");         
        anime({
            targets: releaseThings,
            keyframes: [
                { opacity: 0, translateX: 0},
                { opacity: 1, translateX: 0},
            ],
            delay: anime.stagger(75, {easing: 'linear'})
        });  
    }, 

    getInArtist: () => {
        let artistDropdown = document.getElementById("artistDropdown");
        let optionSelected = artistDropdown.options[artistDropdown.selectedIndex].text;
        let artistList = [];
        Release.get()
        
        let artists = Release.results;
        artists.forEach(artist => {
            let artistName = artist.title.split("-")[0];
            artistList.push(artistName);
        })
        

        let releaseArray = artistList.filter(function (e) {
            return e.includes(optionSelected);
        });
        console.log(releaseArray);
        releaseDiv.innerHTML = null;
        releaseArray.forEach(release => {

            // Slide bar
            let slider = document.querySelector("#releaseSizeRange");
            slider.addEventListener("input",function()
            {
                releaseItem.el.style.width = `${slider.value}px`;
                releaseItem.el.style.height = `${slider.value}px`;               
            }) 

            releaseArray.push(release);
            let releaseItem = Release.createReleaseObj(release);
            releaseDiv.appendChild(releaseItem.el);
        });
        let releaseThings = document.querySelectorAll(".release-entry");         
        anime({
            targets: releaseThings,
            keyframes: [
                { opacity: 0, translateX: 0},
                { opacity: 1, translateX: 0},
            ],
            delay: anime.stagger(75, {easing: 'linear'})
        });  
    }, 


    getInStyle: () => {
        const releaseDiv = document.getElementById("myData");
        let styleDropdown = document.getElementById("styleDropdown");
        let optionSelected = styleDropdown.options[styleDropdown.selectedIndex].text;
        Release.get()
        let releaseArray = Release.results.filter(function (e) {
            return e.style.includes(optionSelected);
        });
        releaseDiv.innerHTML = null;
        releaseArray.forEach(release => {
            let slider = document.querySelector("#releaseSizeRange");
            slider.addEventListener("input",function()
            {
                releaseItem.el.style.width = `${slider.value}px`;
                releaseItem.el.style.height = `${slider.value}px`;               
            }) 
            releaseArray.push(release);
            let releaseItem = Release.createReleaseObj(release);
            releaseDiv.appendChild(releaseItem.el);
        });
        let releaseThings = document.querySelectorAll(".release-entry");         
        anime({
            targets: releaseThings,
            keyframes: [
                { opacity: 0, translateX: 0},
                { opacity: 1, translateX: 0},
            ],
            delay: anime.stagger(75, {easing: 'linear'})
        });  
    },

    showCloseBtn: true,
    show: () => {

        // create filters container div
        let filterDiv = document.createElement('div');
        filterDiv.className = 'filterDiv';

        // create filter content
        let filterContent = document.createElement('div');
        filterContent.className = 'filter-content';

        // Create Title
        let filterTitle = document.createElement("h5");
        filterTitle.innerText = 'Filter Results';
        filterContent.appendChild(filterTitle);

        // create genre filter 
        let genreFilter = document.createElement("select");
        // set attributes and classes
        genreFilter.setAttribute("name", "genres");
        genreFilter.setAttribute("id", "genreDropdown");
        genreFilter.className = "dropdown";

        // create Style filter
        let styleFilter = document.createElement("select");
        // set attributes and classes
        styleFilter.setAttribute("name", "styles");
        styleFilter.setAttribute("id", "styleDropdown");
        styleFilter.className = "dropdown";

        // create artist filter
        let artistFilter = document.createElement("select");
        // set attributes and classes
        artistFilter.setAttribute("name", "artists");
        artistFilter.setAttribute("id", "artistDropdown");
        artistFilter.className = "dropdown";

        // Create close button
        let closeBtn = document.createElement('button');
        closeBtn.innerHTML = '&times;';
        closeBtn.className = 'filter-close-btn';
        closeBtn.classList.add('button');
        closeBtn.addEventListener('click', ()=> {
            App.rootEL.removeChild(filterDiv);
        })
        filterDiv.appendChild(closeBtn);

/*         // Create confirm btn
        let confirmBtn = document.createElement('button');
        confirmBtn.innerHTML = 'Apply Filters';
        confirmBtn.className = 'filter-apply-btn';
        confirmBtn.classList.add('button'); */

        genreFilter.addEventListener("change", () => {
            Filters.getInGenre();
        });

        styleFilter.addEventListener("change", () => {
            Filters.getInStyle();
        })
/*         filterDiv.appendChild(confirmBtn);
 */
        // append genre filter to filter content
        filterContent.appendChild(genreFilter);
        filterContent.appendChild(artistFilter);
        filterContent.appendChild(styleFilter);


        // append content to main div
        filterDiv.appendChild(filterContent);
        // append append filterdiv to rootEl
        App.rootEL.appendChild(filterDiv);


        // ANIM
        anime({
            targets: filterDiv, 
            keyframes: [
                { opacity: 0, top: '65%', duration: 0, easing: 'easeOutCubic' },
                { opacity: 1, top: '155px', right: 0, duration: 500, easing: 'easeOutCubic' }
            ]
        })

        // add esc key press function to trigger Modal.remove()
        Filters.filterEscKey = (e) => {
            if(e.keyCode == 27){
                console.log("esc key!");
                Filter.remove();
            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Filters.filterEscKey);
    },

    remove: () => {
        // get 
        let filterDiv = document.querySelector('.filterDiv');

        if(filterDiv == null){

        }else{
            // filterDiv exit animation
            anime({
                targets: filterDiv,
                opacity: 0,
                duration: 150, 
                right: '-20%',
                easing:  'linear',
                complete: () => {
                    filterDiv.remove();
                }
            });
        }
 
        // stop listening for esc key
        document.removeEventListener('keydown', Filters.filterEscKey);
    }
}

export { Filters }