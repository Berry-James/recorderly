// Imports
import { App } from '../components/App.js';
import { Release } from '../components/Release.js';
import { Notify } from '../components/Notify.js';
import { Tutorial } from '../components/Tutorial.js';
import { Filters } from '../components/Filters.js';
import { Loader } from '../components/Loader.js';
import { Intersection } from '../components/Intersection.js';

function searchPageController(){

    let data = {
        title: "Search for a release here",        
    }

    App.loadPage('Search', 'template-page-search', data, () =>{   
        // create empty array to store releases
        const releaseArray = [];

        // show tutorial
        Tutorial.show(`Search for a release in the bar above`);

        // release container
        const releaseDiv = document.getElementById("myData");
        // next page button
        const nextPageBtn = document.querySelector("#nextPage");
        // search bar
        const searchBar = document.getElementById("searchBar");
        // tutorial overlay
        const overlayDiv = document.querySelector('.tutorial-overlay');
        // filter button
        const filterBtn = document.querySelector("#filters-btn");

        // DISPLAY FILTERS DROPDOWN ON BUTTON PRESS
        filterBtn.addEventListener("click", () => {
            // if filterdiv exists
            if(document.querySelector(".filterDiv")) {
                Filters.remove();
            } else {
                // show
                Filters.show();
                // get data
                getResultGenres();
            };
        });

        // add listener to search bar
        searchBar.addEventListener("keydown", function(event) {
            if (event.keyCode == 13) {
                // hide tutorial
                Tutorial.remove();
                // get results func
                getSearchResults();
                // if overlayDiv does not exist, do nothing
                if (typeof overlayDiv != 'undefined') {
                    
                }else{
                    // remove tutorial div
                    Tutorial.remove();
                };
            };
        });

        // get all result genres/styles
        function getResultGenres(){
            // loop through search results (GENRE)
            Release.search.forEach(genre => {
                const genreDropDown = document.querySelector("#genreDropdown");
                const genreOption = document.createElement("option");

                // loop through releases' genre array and create option for each
                genre.genre.forEach(individual => {
                    genreOption.innerText = individual;
                    genreOption.setAttribute("value", name);
                });

                // append each
                genreDropDown.appendChild(genreOption);
            });

            // loop through search results (STYLE)
            Release.search.forEach(style => {
                const styleDropdown = document.querySelector("#styleDropdown");
                const styleOption = document.createElement("option");

                // loop through releases' style array and create option for each
                style.style.forEach(name => {
                    styleOption.innerText = name;
                    styleOption.setAttribute("value", name);
                });

                // append each
                styleDropdown.appendChild(styleOption);
            });
        };

        // DISPLAY SEARCH RESULTS
        function getSearchResults(){
            // clear release container
            releaseDiv.innerHTML = null;
            // create empty array to store objects
            Release.search = [];
            // show loader
            Loader.show('Searching...');
            // get releases
            Release.get()
            .then(releases => {
                // if a modal overlay exists (as a result of the Loader), remove it
                if(document.querySelector(".modal-overlay")) {
                    Loader.remove();
                };

                // loop through releases array
                releases.forEach(release => {
                    // push each release to Release.search array
                    Release.search.push(release);
                    // push release to releaseArray 
                    releaseArray.push(release);
                    // create release objects for each
                    const releaseItem = Release.createReleaseObj(release);
                    // append to container
                    releaseDiv.appendChild(releaseItem.el);
                });

                // get all releases and observe
                let allReleases = document.querySelectorAll(".release-entry");
                allReleases.forEach(release => {
                    Intersection.releases(release);
                });  
            })
            
            .catch(err => {
                console.log(err);
                Notify.show('Problem loading parts');
            });

        };

        // NEXT PAGE FUNC
        function getNextPage() {

            // add listener
            nextPageBtn.addEventListener("click", () => {
                Loader.show('Loading more releases...')
                Release.getNextPage()
                .then(releases => {
                    // loop through releases array and create objects for each release, append
                    releases.forEach(release => {
                        const releaseItem =  Release.createReleaseObj(release);
                        releaseDiv.appendChild(releaseItem.el);                      
                    });         
                    // get all rendered releases and observe
                    let allReleases = document.querySelectorAll(".release-entry");
                    allReleases.forEach(release => {
                        Intersection.releases(release);
                    });     
                    // hide loader
                    Loader.remove();
  
                })
                .catch(err => {
                    console.log(err);
                    // Notify error
                    Notify.show('Problem loading releases');
                });
            });
            
        };
        
        // focus on search bar automatically on redirect
        searchBar.focus();
        // initialise next page function
        getNextPage(); 
        });  
    };

export { searchPageController }