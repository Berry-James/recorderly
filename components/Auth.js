import { Notify } from "./Notify.js";
import { User } from "./User.js";
import { Modal } from "./Modal.js";
import { Loader } from "./Loader.js";

const Auth = {
    // User authentication status
    authenticated: false,

    signIn: (userData) => {

        // loader active
        Loader.show('Signing you in..')

        // send userData to backend API using fetch - POST
        fetch('https://recorderly-backend.herokuapp.com/api/auth/signin', {
            method: 'post',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(userData)
        })
        .then(res => {
            if(res.status !=200){
                // problem signing in
                res.json().then(res => {
                    // notify the returned message & remove loader
                    Notify.show(res.message);
                    Loader.remove();
                });
               
            }else{
                // sign in success
                res.json().then(res => {
                    // Remove loader
                    Loader.remove();

                    // 1. save the token to local storage
                    localStorage.setItem('token', res.token);
                    // 2. set Auth.authenticated to true
                    Auth.authenticated = true;
                    localStorage.setItem('userId', res.user._id);
                    // 3. set user info in User object
                    User.email = res.user.email;
                    User.id = res.user._id;
                    User.collection = res.user.user_collection;
                    // 4. redirect to homepage
                    location.hash = '#';
                    // 5. show welcome notification
                    Notify.show(`👋 Welcome ${User.email.split('@')[0]}!`)
                    // 6. Update user collection/wishlist counts
                    User.updateCounts();
                });
            }
        })
        .catch(err => {
            console.log(err);
            Notify.show('❌ Problem Signing in');
        });
    },

    check: (callback) => {
        // 1. check if JWT token exists in local storage
        if(localStorage.getItem('token')){
            // validate token using backend API - make fetch request (GET)
            fetch('https://recorderly-backend.herokuapp.com/api/auth/validate', {
                headers: { "Authorization": `Bearer ${localStorage.token}` }
            })
            .then(res => {
                if(res.status !=200){
                    // token validation failed
                    // set Auth.authenticated = false
                    Auth.authenticated = false;
                    // remove the local token
                    localStorage.removeItem('token');
                    // redirect to sign in page
                    location.hash = '#';
                    if(typeof callback == 'function'){
                        callback();
                    }

                }else{
                    // token valid!
                    res.json().then(res => {
                        // set Auth.authenticated = true
                        Auth.authenticated = true;
                        // set user Info (res.user)
                        // set user info in User
                        User.email = res.user.email;
                        User.updateCounts()
                        // callback
                        if(typeof callback == 'function'){
                            callback();
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                // Notify error
                Notify.show('❌ Problem authorising');
                // run callback function (if)
                if(typeof callback == 'function'){
                    callback();
                }
            })

        }else{
            // no local token
            // redirect to sign in page
            location.hash = '#';
            if(typeof callback == 'function'){
                callback();
            }
        }
    },

    signOutModal: () => {
        // get div ID for modal
        const modalTemplate = document.querySelector('#template-signOut-modal').innerHTML;
        // show modal
        Modal.show(modalTemplate);
        let modal = document.querySelector(".myModal");
        modal.style.padding = "0em";
        // add button events
            // sign out button
            document.querySelector("button#logOut-btn.button").addEventListener('click', () => {
                Auth.signOut();
            });
            // cancel button (close modal)
            document.querySelector("button#cancel-btn.button").addEventListener('click', () => {
                Modal.remove(modalTemplate);
                window.location.href="#";
            });
            // Modal close btn listener
            document.querySelector(".modal-close-btn").addEventListener('click', () => {
                Modal.remove(modalTemplate);
                window.location.href="#";
            });
            // Modal overlay (background) event listener
            document.querySelector(".modal-overlay").addEventListener("click", () => {
                Modal.remove(modalTemplate);
                window.location.href="#";
            })    
    },   

    signOut: () => {
        // remove local token
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        // set Auth.authenticated to false
        Auth.authenticated = false;
        // redirect to sign in page
        location.hash = '#';
        // Show sign out notification
        Notify.show('✅ You have been signed out');
    }
}

export { Auth }