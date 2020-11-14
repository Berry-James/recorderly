import { Notify } from "./Notify.js";
import { Collection } from "./Collection.js";
import { Auth } from "./Auth.js";


const User = {
    email: null,
    lastLogin: null,
    collectionCount: null,
    wishCount: null,
    id: null,

    getSpecifiedUsers: () => {
        fetch(`https://recorderly-backend.herokuapp.com/api/users/${window.url.search}`)
        .then(res => res.json())
            .then(user => {
                resolve(user);
                console.log(user);
            })
        },
   
    create: (userData) => {
        // send userData to backend API using fetch - POST
        fetch('https://recorderly-backend.herokuapp.com/api/users', {
            method: 'post',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        })
        .then(res => {
            if(res.status != 201){
                // problem creating user
                Notify.show("Problem Creating User");
            }else{
                // user created successfully
                Notify.show("User Account Created");
                // redirect user to the sign in page #signIn
                location.hash = '#signIn';
                Notify.show("Please Sign in");
            }
        })
        .catch(err => {
            console.log(err);
            Notify.show("Problem Creating User");
        })
    },

    update: () => {

    },

    delete: () => {

    },

    displayProfile: () => {

    },

    updateCounts: () => {

        Collection.getUserCollection()
        .then(releases => {
            User.collectionCount = releases.user_collection.length;
            User.wishCount = releases.wishlist.length;
        })
    },
}

export { User }