import { Notify } from "./Notify.js";
import { Auth } from "./Auth.js";
import { Burger } from './Burger.js';
import { Nav } from './Nav.js';
import { Collection } from './Collection.js';

const App = {
    // App properties
    name: "Recorderly",
    version: "0.1.0",
    author: "James Berry",
    rootEL: document.querySelector("#app"),
    routes: {},
    user_collection: [],

    // Initialise notification, check auth status, init router
    init: () => { 
        Notify.init();
        Auth.check(() => {
            App.router();
            window.addEventListener('hashchange', App.router);
    });
},

    addRoute: (path, pageController) => {
        // adding an entry to App.routes
        App.routes[path] = {
            controller: pageController
        }
    },

    router: () => {
        // get the current hash location
        const path = location.hash || '#';
        // find route for this path in App.routes
        const route = App.routes[path];
        // if route exists for this path
        if(route){
            route.controller();
        // run the route.controller
        }/* if(!route){
            alert('no route present');
        } 
        
/*         else{
        // show 404 alert
            App.loadPage('404 Page/File Not Found', 'template-page-404', {});
        } */
    },

    loadPage: (title, templateId, data, callback) => {
        // set document title to current page title
        document.title = title;

        // grab the template and store in a variable
        let template = document.querySelector(`#${templateId}`).innerHTML;
        // Render the page with template and data (if any)
        let output = Mustache.render(template, data);

        // insert the output HTML into the rootEL
        App.rootEL.innerHTML = output;
        App.loadNav();

        // run the callback (if it exists)
        if( typeof callback == 'function' ){
            callback();
        }
    },

    loadNav: () => {
        // Load Navbar template from NAV coponent and execute show()
        let navTemplate = document.querySelector("#template-nav").innerHTML;
        Nav.show(navTemplate);

        // get main nav div
        const collectionBtn = document.querySelector("#collectionBtn");
        const signInBtn = document.querySelector("#signInBtn");
        const burgerBtn = document.querySelector("#hamburger");
        const burgerTemplate = document.querySelector("#template-hamburger").innerHTML;
        
        burgerBtn.addEventListener("click", function(){
            if(!Burger.active) {
                Burger.show(burgerTemplate);
            } else if(Burger.active) {
                Burger.remove();
            }
        });

        if(Auth.authenticated == true){
            // User is signed in, show 'Collection' button and change Sign-in btn to 'Sign Out'
            collectionBtn.classList.remove("collection-btn-hide");
            collectionBtn.classList.add("collection-btn-show");
            signInBtn.innerText = "Sign Out";
            signInBtn.setAttribute('href', '#signOut');
            collectionBtn.setAttribute('href', '#collection');
        }
        // if user is Not signed in, make 'Collection' button redirect to sign-in page
        else{
            collectionBtn.setAttribute('href', '#signIn');
        }
    },
}

export { App }