// Imports
import { App } from './../components/App.js';
import { User } from '../components/User.js';

function signUpPageController(){

    // load particles backdrop
    particlesJS.load('particles-js', 'assets/particles.json', function() {
    });

    App.loadPage('Sign Up', 'template-page-sign-up', {}, () => {
        // get sign up form
        let signUpForm = document.querySelector('#form-sign-up')
        // submit event
        signUpForm.addEventListener('submit', (e) => {
            // prevent the form from loading new page
            e.preventDefault();
            // create formData object
            let formData = new FormData(signUpForm);
            // create empty object
            let formDataObj = {};
            // loop through formData entries
            for(let field of formData.entries()){
              formDataObj[field[0]] = field[1]
            }
            // send the form data object to User.create
            User.create(formDataObj);
        });
            
    });
}

export { signUpPageController }