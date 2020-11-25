// Imports
import { App } from '../components/App.js';
import { Release } from '../components/Release.js';
import { Notify } from '../components/Notify.js';
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Modal } from '../components/Modal.js';
import { Collection } from '../components/Collection.js';
import { Tutorial } from '../components/Tutorial.js';
import { Filters } from '../components/Filters.js';
import { Loader } from '../components/Loader.js';
import { Intersection } from '../components/Intersection.js';


function searchPageController(){

    function navColour() {
        window.addEventListener("scroll", () => {
            let navBarText = document.querySelector(".nav-title");  
            navBarText.style.color = 'black';
        });
    }

    let data = {
        title: "Search for a release here",        
    }

    App.loadPage('Search', 'template-page-search', data, () =>{   

        const releaseArray = [];

        navColour();

        Tutorial.show(`<p>Search for a release in the bar above</p>`);
        
        let nextPageBtn = document.querySelector("#nextPage")
        const releaseDiv = document.getElementById("myData");
        let searchBar = document.getElementById("searchBar");
        let introText = document.querySelector("#introText");
        let genreDropdown = document.querySelector("#genreDropdown");
        let searchBtn = document.querySelector("#searchBtn");
        let QRBtn = document.querySelector("#QRBtn");
        let overlayDiv = document.querySelector('.tutorial-overlay');
        let genreBtn = document.querySelector('#genre-select-btn')
        let artistBtn = document.querySelector('#artist-select-btn')
        let filterBtn = document.querySelector("#filters-btn");

        // DISPLAY FILTERS DROPDOWN ON BUTTON PRESS
        filterBtn.addEventListener("click", () => {
            if(document.querySelector(".filterDiv")) {
                Filters.remove();
            } else {
                Filters.show();
                getResultGenres();
            }
        });

        searchBar.addEventListener("keydown", function(event) {
            if (event.keyCode == 13) {
                Tutorial.remove();
                getSearchResults();
                if (typeof overlayDiv != 'undefined') {
                    
                }else{
                    Tutorial.remove();
                }
            }
        })  

        function getResultGenres(){
            Release.get()
            .then(release => {

                release.forEach(genre => {
                    if (genre.type != "release") {
                    }
                    let genreDropDown = document.querySelector("#genreDropdown");
                    let genreOption = document.createElement("option");
                    genreOption.innerHTML = genre.genre;
                    genreOption.setAttribute("value", genre.genre);
                    genreDropDown.appendChild(genreOption);
                })

                release.forEach(style => {
                    let styleDropdown = document.querySelector("#styleDropdown");
                    let styleOption = document.createElement("option");
                    style.style.forEach(name => {
                        styleOption.innerText = name;
                        styleOption.setAttribute("value", name);
                    });
                    styleDropdown.appendChild(styleOption);
                })
            })
            
            .catch(err => {
                console.log(err);
                Notify.show('Problem loading genres');
            });
        }

        function getInGenre() {
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
                    { opacity: 0, translateY: '15px'},
                    { opacity: 1, translateY: '0px'},
                ],
                easing: 'easeOutElastic(1, .6)',
                delay: anime.stagger(100, {easing: 'linear'})
            });  
        } 

        function getSearchResults(){
            releaseDiv.innerHTML = null;
            Release.search = [];
            Loader.show('Searching...');
            Release.get()
            .then(releases => {
                if(document.querySelector(".modal-overlay")) {
                    Loader.remove();
                }
                // loop through releases array
                releases.forEach(release => {
                        Release.search.push(release);
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
/*                 anime({
                    targets: releaseThings,
                    keyframes: [
                        { opacity: 0, translateY: '25px',},
                        { opacity: 1, translateY: '0px', },
                    ],
                    easing: 'easeOutElastic(1, .6)',
                    duration: 100,
                    delay: anime.stagger(15, {easing: 'linear'})
                });   */

                // MOUSEOVER 
                releaseThings.forEach(release => {
                    release.addEventListener("mouseover", () => {
                        anime({
                            targets: release,
                            rotateX: '0deg',
                            rotateY: '0deg',
                            duration: 50,
                            easing: 'linear'
                        })
                    })
                    release.addEventListener("mouseout", () => {
                        anime({
                            targets: release,
                            duration: 50,
                            easing: 'linear'
                        })
                    })
                })
            })
            
            .catch(err => {
                console.log(err);
                Notify.show('Problem loading parts');
            });

            }


             
        function getNextPage() {
            nextPageBtn.addEventListener("click", () => {
                Release.getNextPage()
                .then(releases => {
                    // loop through parts array
                    releases.forEach(release => {
                        if (release.type != "release") {
                        }else{
                            let slider = document.querySelector("#releaseSizeRange");

                           const releaseItem =  Release.createReleaseObj(release);
                           releaseDiv.appendChild(releaseItem.el);
                           releaseItem.el.style.width = `${slider.value}px`;
                           releaseItem.el.style.height = `${slider.value}px`; 
                           slider.addEventListener("input",function()
                           {
                               releaseItem.el.style.width = `${slider.value}px`;
                               releaseItem.el.style.height = `${slider.value}px`;               
                           }) 
                        }
                        
                    });         
                    let releaseThings = document.querySelectorAll(".release-entry");
                    releaseThings.forEach(release => {
                        if(release.style.opacity == 1) {

                        }else {
                            anime({
                                targets: release,
                                keyframes: [
                                    { opacity: 0, translateX: 20, rotate: 20 },
                                    { opacity: 1, translateX: 0, rotate: 0 },
                                ],
                                delay: anime.stagger(75, {easing: 'linear'})
                            });      
                        }
                    })     
  
                })
                .catch(err => {
                    console.log(err);
                    Notify.show('Problem loading releases');
                });
            });
            
        }

        searchBar.focus();
        getNextPage(); 
        const testBtn = document.getElementById("testBtn")
        });  
    };

export { searchPageController }