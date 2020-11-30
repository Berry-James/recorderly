import { App } from "./App.js";

const Nav = {

    // SHOW NAVBAR
    show: () => {
        
        // create empty object
        const navbar = {};
        // get navbar template from HTML
        navbar.template = document.querySelector("#template-nav").innerHTML;
        // set data
        navbar.data = {
            title: "Recorderly",
        };
        // create div for navbar
        navbar.el = document.createElement('div');
        // render innerHTML with Mustache based on template and data
        navbar.el.innerHTML = Mustache.render(navbar.template, navbar.data);
        App.rootEL.appendChild(navbar.el);

        // run events
        Nav.events();
    },

    events: () => {
        // get window location
        let hash = location.hash;
        let searchbar = document.querySelector(".searchBar");
        let searchInput = document.querySelector(".searchInput");
        // if no hash value (i.e. home page)
        if(hash == ''){
            // add event listener to redirect on click of search bar
            searchbar.addEventListener("click", () => {
                location.replace(window.location.pathname + '#search')
            });

        // if on collection/wishlist pages, change search bar placeholder
        }if(hash == '#collection'){
            searchInput.placeholder = "Search Collection";
        };
        if(hash == '#wishlist'){
            searchInput.placeholder = 'Search Wishlist';
        }
        // if on search page, change ID
        if(hash == '#search'){
            searchbar.querySelector("input").setAttribute("id", 'searchBar');
        };
    }
}

export { Nav }

