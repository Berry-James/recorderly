const Mode = {

    Is: 'light',

        init: () => {
            // check if mode preference is pre-existing
            if(window.localStorage.getItem("isMode")) {

            // set current session mode to token value
            Mode.Is = window.localStorage.getItem("isMode");
                
            } else {
                // if token does not exist, create it and default to light mode
                let isMode = window.localStorage.setItem("isMode", "light")
                Mode.Is = 'light';
            }

        },

        toggle: () => {
            // change to opposite mode locally and update token
            if(Mode.Is == 'light'){
                Mode.Is = 'dark'
                window.localStorage.setItem("isMode", "dark");
            } else if(Mode.Is == 'dark'){
                Mode.Is = 'light'
                window.localStorage.setItem("isMode", "light");
            }

        },

        set: () => {
            // get paramaters to apply class to
            const body = document.querySelector("body");
            const app = document.querySelector("#app");
            const header = document.querySelector(".page-header");


            // add/remove classes depending on Mode.Is value
            if(Mode.Is == 'light') {
                body.classList.remove("is-dark-mode");
                app.classList.remove("is-dark-mode");
                header.classList.remove("is-dark-mode");

            } else if(Mode.Is == 'dark') {
                body.classList.add("is-dark-mode");
                app.classList.add("is-dark-mode");
                header.classList.add("is-dark-mode");
            }
        }
}

export { Mode }