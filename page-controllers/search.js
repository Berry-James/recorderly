// Imports
import { App } from '../components/App.js';
import { Release } from '../components/Release.js';
import { Notify } from '../components/Notify.js';
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Modal } from '../components/Modal.js';
import { Collection } from '../components/Collection.js';
import { Tutorial } from '../components/Tutorial.js';
import { Filters } from '../components/Filters.js';


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

                console.log("got genres!")
                release.forEach(genre => {
                    if (genre.type != "release") {
                    }
                    let genreDropDown = document.querySelector("#genreDropdown");
                    let genreOption = document.createElement("option");
                    genreOption.innerHTML = genre.genre;
                    genreOption.setAttribute("value", genre.genre);
                    genreDropDown.appendChild(genreOption);
                })

                release.forEach(artist => {
                    let artistDropdown = document.querySelector("#artistDropdown");
                    let artistOption = document.createElement("option");
                    let artistName = artist.title.toString().split("-")[0];
                    artistOption.innerHTML = artistName;
                    artistOption.setAttribute("value", artistName);
                    artistDropdown.appendChild(artistOption);

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

        function getInStyle() {
            let styleDropdown = document.getElementById("styleDropdown");
            let optionSelected = styleDropdown.options[styleDropdown.selectedIndex].text;
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
        } 

        function getInArtist() {
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
        } 

        function getSearchResults(){
            releaseDiv.innerHTML = null;
            let loadingAnim = document.createElement("img");
            loadingAnim.setAttribute("src", "./imgs/svg/loader-main.svg");
            loadingAnim.className = 'loading-icon'; 
            App.rootEL.appendChild(loadingAnim);
            Release.get()
            .then(releases => {
                
                console.log("got releases!");
                // loop through releases array
                releases.forEach(release => {
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
                App.rootEL.removeChild(loadingAnim);
                let releaseThings = document.querySelectorAll(".release-entry");         
                anime({
                    targets: releaseThings,
                    keyframes: [
                        { opacity: 0, translateY: '25px',},
                        { opacity: 1, translateY: '0px', /* rotateX: '-8deg', rotateY: '-16deg' */},
                    ],
                    easing: 'easeOutElastic(1, .6)',
                    duration: 100,
                    delay: anime.stagger(15, {easing: 'linear'})
                });  

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
                    console.log("got more releases!");
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

/*          function getNextPage(){
            window.onscroll = function(ev) {
                let pageCounter = 2;
                if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) { 
                    pageCounter ++;
                    console.log(pageCounter);
                    return new Promise((resolve, reject) => {
                        // fetch parts.json
                        fetch(`https://api.discogs.com/database/search?q=${document.getElementById("searchBar").value}&token=VGCcdPkiXMOSimYzzdmpboMlvbMhSlZejvcNwWYL&page=2&per_page=50`)
                        .then(res => res.json())
                        .then(parts => {
                            resolve(parts.results);
                            console.log(parts.results);
                            parts.forEach(part => {
                                if (part.type != "release") {
                            
                                }else{
                                    const release = Part.createPartObj(part);
                                    releaseDiv.appendChild(release.el);
                                }
                            });
                        })
                        .catch(err => {
                            reject(err);
                        })
                    });   
                }
            };
        } */

 /*        function coverAnimate() {
        
        // Create the renderer and add it to the page's body element
        var renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );
      
        // Create the scene to hold the object
        var scene = new THREE.Scene();
      
        // Create the camera
        var camera = new THREE.PerspectiveCamera(
          35,                                     // Field of view
          window.innerWidth / window.innerHeight, // Aspect ratio
          0.1,                                    // Near plane distance
          1000                                    // Far plane distance
        );
      
        // Position the camera
        camera.position.set( -5, 0, 20 );
      
      
        // Add the lights
      
        var light = new THREE.PointLight( 0xffffff, .4 );
        light.position.set( 10, 10, 10 );
        scene.add( light );
      
 
      
      
        // Load the textures (book images)
        var textureLoader = new THREE.TextureLoader();
        THREE.ImageUtils.crossOrigin = '';
        var bookCoverTexture = textureLoader.load( 'https://cors-anywhere.herokuapp.com/https://img.discogs.com/gDfE0-wPiR1LRCAvRO31tu46uwc=/fit-in/300x300/filters:strip_icc():format(jpeg):mode_rgb():quality(40)/discogs-images/R-15636825-1594982655-4662.jpeg.jpg' );
        var bookSpineTexture = textureLoader.load( 'southern-gems-spine.png' );
        var bookBackTexture = textureLoader.load( 'southern-gems-back.png' );
        var bookPagesTexture = textureLoader.load( 'southern-gems-pages.png' );
        var bookPagesTopBottomTexture = textureLoader.load( 'southern-gems-pages-topbottom.png' );  
      
      
        // Use the linear filter for the textures to avoid blurriness
        bookCoverTexture.minFilter
          = bookSpineTexture.minFilter
          = bookBackTexture.minFilter
          = bookPagesTexture.minFilter
          = bookPagesTopBottomTexture.minFilter
          = THREE.LinearFilter;
      
      
        // Create the materials
      
        var bookCover = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookCoverTexture } );
        var bookSpine = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookSpineTexture } );
        var bookBack = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookBackTexture } );
        var bookPages = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookPagesTexture } );
        var bookPagesTopBottom = new THREE.MeshLambertMaterial( { color: 0xffffff, map: bookPagesTopBottomTexture } );
      
        var materials = [
          bookPages,          // Right side
          bookSpine,          // Left side
          bookPagesTopBottom, // Top side
          bookPagesTopBottom, // Bottom side
          bookCover,          // Front side
          bookBack            // Back side
        ];
      
        // Create the book and add it to the scene
        var book = new THREE.Mesh( new THREE.BoxGeometry( 10, 10, 0.2, 4, 4, 1 ), materials );
        scene.add( book );
      

      
        // Begin the animation
        animate();
      
      
        /*
          Animate a frame
        */
      /*
        function animate() {
  
      
          // Render the frame
          renderer.render( scene, camera );
      
          // Keep the animation going
          requestAnimationFrame( animate );
        }
      }
 */
        searchBar.focus();
        getNextPage(); 
        const testBtn = document.getElementById("testBtn")
/*         testBtn.addEventListener("click", function(){
            releaseStagger();
        }) */

});  
};

export { searchPageController }