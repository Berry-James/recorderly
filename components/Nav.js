import { App } from "./App.js";
import { Auth } from "./Auth.js";
import anime from './../node_modules/animejs/lib/anime.es.js';
import { Modal } from "./Modal.js";

const Nav = {
    show: () => {
        
        const navbar = {};
        navbar.template = document.querySelector("#template-nav").innerHTML;
        navbar.data = {
            title: "Recorderly",
        };
        navbar.el = document.createElement('div');

        navbar.el.innerHTML = Mustache.render(navbar.template, navbar.data);
        App.rootEL.appendChild(navbar.el);


        Nav.events();
    },

    events: () => {
        let hash = location.hash;
        let searchbar = document.querySelector(".searchBar");
        let searchInput = document.querySelector(".searchInput");
        if(hash == ''){
            searchbar.addEventListener("click", () => {
                location.replace(window.location.pathname + '#search')
            });
        }if(hash == '#collection'){
            searchInput.placeholder = "Search Collection";
        };
        
        if(hash == '#search'){
            searchbar.querySelector("input").setAttribute("id", 'searchBar');
        };
    }
}

export { Nav }

