import { App } from "./App.js";
import { Release } from "./Release.js";
import { Intersection } from "./Intersection.js";
import anime from './../node_modules/animejs/lib/anime.es.js';

const Filters = {

    // GET RELEASE IN CHOSEN GENRE
    getInGenre: () => {
        const releaseDiv = document.getElementById("myData");
        let genreDropDown = document.getElementById("genreDropdown");
        let optionSelected = genreDropDown.options[genreDropDown.selectedIndex].text;
        let releaseArray = Release.search.filter(function (e) {
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
        releaseThings.forEach(release => {
            Intersection.releases(release);
        })      
    }, 

    // GET RELEASE IN CHOSEN STYLE
    getInStyle: () => {
        // get releaes container, style dropdown, selection from dropdown
        const releaseDiv = document.getElementById("myData");
        let styleDropdown = document.getElementById("styleDropdown");
        let optionSelected = styleDropdown.options[styleDropdown.selectedIndex].text;
        // filter currently displayed releases based on option selected in dropdown
        let releaseArray = Release.search.filter(function (e) {
            return e.style.includes(optionSelected);
        });
        // clear release container
        releaseDiv.innerHTML = null;
        releaseArray.forEach(release => {
            let slider = document.querySelector("#releaseSizeRange");
            slider.addEventListener("input",function()
            {
                releaseItem.el.style.width = `${slider.value}px`;
                releaseItem.el.style.height = `${slider.value}px`;               
            }) 
            // create objects for each release and append to container
            let releaseItem = Release.createReleaseObj(release);
            releaseDiv.appendChild(releaseItem.el);
        });
        let releaseThings = document.querySelectorAll(".release-entry");
        releaseThings.forEach(release => {
            // Add observer to each release
            Intersection.releases(release);
        })      
    },

    // SORT SEARCH
    sort: (type) => {
        const releaseDiv = document.getElementById("myData");
        const filter = [];
            // push each release from current search to 'filter' array
            Release.search.forEach(release => {
                filter.push(release)
            })

            // if filtering by artist name
            if(type == 'artist') {
                filter.sort(function(a, b) {
                    let textA = a.title.toUpperCase().split(' - ')[0];
                    let textB = b.title.toUpperCase().split(' - ')[0];
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            }

            // if filtering by release title
            if(type == 'name') {
                filter.sort(function(a, b) {
                    let textA = a.title.toUpperCase().split(' - ')[1];
                    let textB = b.title.toUpperCase().split(' - ')[1];
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0;
                });
            }

            // if filtering by release year
            if(type == 'year') {
            filter.sort(function(a, b){
                return a.year - b.year;
                });
            }

            // clear contents of release container
            releaseDiv.innerHTML = null;
            // create release object for each release, append to container
            filter.forEach(item => {
                const releaseItem = Release.createReleaseObj(item);
                releaseDiv.appendChild(releaseItem.el);
            });

            // Add intersection observer to each release
            let releases = document.querySelectorAll(".release-entry");
            releases.forEach(release => {
                Intersection.releases(release);
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

        // create sorts menu
        const sortBtn = document.createElement('a');
        sortBtn.classList.add('sort-btn');
        sortBtn.icon = document.createElement("i");
        sortBtn.icon.classList.add("fas", "fa-chevron-left");
        sortBtn.innerText = 'Sort';
        sortBtn.appendChild(sortBtn.icon);

        // create sort container
        const sortContainer = document.createElement("div");
        sortContainer.classList.add("sort-container", "is-hidden");
        // create year sort btn
        const yearBtn = document.createElement('a');
        yearBtn.id = "yearBtn";
        yearBtn.innerText = 'By year';
        // create artist sort btn
        const artistBtn = document.createElement('a');
        artistBtn.id = "artistBtn";
        artistBtn.innerText = 'By artist name';
        // create title sort btn
        const nameBtn = document.createElement('a');
        nameBtn.id = "nameBtn";
        nameBtn.innerText = 'By release name';

        // Append sort functions to filter div
        sortContainer.appendChild(yearBtn);
        sortContainer.appendChild(artistBtn);
        sortContainer.appendChild(nameBtn);
        filterContent.appendChild(sortBtn);
        filterContent.appendChild(sortContainer);

        // TOGGLE SORT DROPDOWN
        sortBtn.addEventListener("click", () => {
            sortContainer.classList.toggle("is-hidden");
            sortBtn.icon.classList.toggle('is-chev-rotated')
        });

        // add listeners for each func
        genreFilter.addEventListener("change", () => {
            Filters.getInGenre();
        });

        styleFilter.addEventListener("change", () => {
            Filters.getInStyle();
        });

        yearBtn.addEventListener("click", () => {
            Filters.sort('year');
        });

        artistBtn.addEventListener("click", () => {
            Filters.sort('artist');
        });

        nameBtn.addEventListener("click", () => {
            Filters.sort('name');
        });

        // Create clear button
        const clearBtn = document.createElement("button");
        clearBtn.innerText = 'Clear';
        clearBtn.classList.add("clear-filter-btn", "button");
        const releaseDiv = document.getElementById("myData");

        // click
        clearBtn.addEventListener("click", () => {
            // clear release container
            releaseDiv.innerHTML = null;
            // create release objects and append for each item in search
            Release.search.forEach(release => {
                const obj = Release.createReleaseObj(release);
                releaseDiv.appendChild(obj.el)
            });

            // add intersection observer to each release el
            let releases = document.querySelectorAll(".release-entry");
            releases.forEach(release => {
                Intersection.releases(release);
            })       
        });

        // append clear btn
        filterContent.appendChild(clearBtn);
        // append genre filter to filter content
        filterContent.appendChild(genreFilter);
        filterContent.appendChild(styleFilter);

        // append content to main div
        filterDiv.appendChild(filterContent);
        // append append filterdiv to rootEl
        App.rootEL.appendChild(filterDiv);
        
        // animate filtersDiv into view
        anime({
            targets: filterDiv, 
            keyframes: [
                { opacity: 0, top: '65%', duration: 0, easing: 'easeOutCubic' },
                { opacity: 1, top: '146px', right: 0, duration: 500, easing: 'easeOutCubic' }
            ]
        })

        // rotate dots
        const dots = document.querySelector("#filters-btn");
        anime({
            targets: dots,
            rotate: '90deg',
            color: '#f8b920',
        })

        // add esc key press function to trigger Modal.remove()
        Filters.filterEscKey = (e) => {
            if(e.keyCode == 27){
                Filter.remove();
            }
        }
        // listen for esc key press
        document.addEventListener('keydown', Filters.filterEscKey);
    },

    remove: () => {
        // get filter Div
        let filterDiv = document.querySelector('.filterDiv');

        // if no filter div, do not try and remove
        if(filterDiv == null){

        }else{
            // filterDiv exit animation
            anime({
                targets: filterDiv, 
                opacity: 0, 
                top: '75px', 
                easing: 'easeOutCubic',
                complete: () => {
                    filterDiv.remove();
                }
            });
            // rotate dots back and change colour
            const dots = document.querySelector("#filters-btn");
            anime({
                targets: dots,
                rotate: '0deg',
                color: '#312b2b'
            })
    
        }
 
        // stop listening for esc key
        document.removeEventListener('keydown', Filters.filterEscKey);
    }
}

export { Filters }