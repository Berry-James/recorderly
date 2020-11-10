// Imports
import { App } from './../components/App.js';
import { Notify } from '../components/Notify.js';
import { User } from '../components/User.js';
import { Auth } from '../components/Auth.js';

function signInPageController(){
    particlesJS.load('particles-js', 'assets/particles.json', function() {
      });

    App.loadPage('Sign In', 'template-page-sign-in', {}, () => {
        // get sign up form
        let signInForm = document.querySelector('#form-sign-in')
        // submit event
        signInForm.addEventListener('submit', (e) => {
            // prevent the form from loading new page
            e.preventDefault();
            // create formData object
            let formData = new FormData(signInForm);
            // create empty object
            let formDataObj = {};
            // loop through formData entries
            for(let field of formData.entries()){
              //  console.log(field[0]+', '+ field[1]);
              formDataObj[field[0]] = field[1]

            }
            // send the form data object to Auth.signIn
            Auth.signIn(formDataObj);
        });
            
    });
}

export { signInPageController }