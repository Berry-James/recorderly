import { Notify } from "./Notify.js";
import { User } from "./User.js";
import { Modal } from "./Modal.js";
import { Collection } from "./Collection.js";

const Auth = {
    // User authentication status
    authenticated: false,

    signIn: (userData) => {
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
                    Notify.show(res.message);
                });
               
            }else{
                // sign in success
                res.json().then(res => {
                    // 1. save the token to local storage
                    localStorage.setItem('token', res.token);
                    // 2. set Auth.authenticated to true
                    Auth.authenticated = true;
                    localStorage.setItem('userId', res.user._id);
                    // 3. set user info in User object
                    User.email = res.user.email;
                    User.id = res.user._id;
                    User.collection = res.user.user_collection;
                    console.log(User.id);
                    // 4. redirect to homepage
                    location.hash = '#';
                    // 5. show welcome notification
                    Notify.show(`👋 Welcome ${User.email.split('@')[0]}!`)
                });
            }
        })
        .catch(err => {
            console.log(err);
            Notify.show('❌ Problem Signing in');
        });
    },

    check: (callback) => {
        // 1. check if jwt token exists in local storage
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
                        console.log("user authorised");
                        // set Auth.authenticated = true
                        Auth.authenticated = true;
                        // set user Info (res.user)
                        // set user info in User
                        User.firstName = res.user.first_name;
                        User.lastName = res.user.last_name;
                        User.email = res.user.email;
                        User.vehicle = res.user.vehicle;
                        User.vehicleImg = res.user.vehicle_img;

                        // get user collection and push to array
                        function getUserCollection() {
                            Collection.getCollection();
                            console.log('done')
                        }

                        // callback
                        if(typeof callback == 'function'){
                            callback();
                        }
                    });
                }
            })
            .catch(err => {
                console.log(err);
                Notify.show('❌ Problem authorising');
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
            document.querySelector(".modal-close-btn").addEventListener('click', () => {
                Modal.remove(modalTemplate);
                window.location.href="#";
            });
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
        Notify.show('✅ You have been signed out');
    }
}

export { Auth }