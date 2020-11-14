import { App } from './App.js';

const Loader = {
    
    show: (message) => {
        // define objects
        const loader = document.createElement("div");
        loader.bg = document.createElement("div");
        loader.icon = document.createElement("img");
        loader.txt = document.createElement("h4");

        // set classes
        loader.className = 'loading-wrapper';
        loader.bg.className = 'modal-overlay';
        loader.icon.className = 'loading-icon'
        loader.txt.className = 'loading-text';

        // set attributes
        loader.icon.setAttribute("src", "./imgs/svg/loader-main.svg");

        // set innertext
        loader.txt.innerText = message;

        // append
        loader.appendChild(loader.icon);
        loader.appendChild(loader.txt);
        App.rootEL.appendChild(loader);
        App.rootEL.appendChild(loader.bg);
    },

    remove: () => {
        // get loader components
        const loader = document.querySelector(".loading-wrapper");
        loader.bg = document.querySelector(".modal-overlay");

        // remove from root element
        App.rootEL.removeChild(loader.bg);
        App.rootEL.removeChild(loader);
    }

}

export { Loader }