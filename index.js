// Import Components ---------------------------
import { App } from './components/App.js';

// Import Page Controllers
import { homePageController } from './page-controllers/home.js';
import { searchPageController } from './page-controllers/search.js';
import { collectionPageController } from './page-controllers/collection.js';
import { wishlistPageController } from './page-controllers/wishlist.js';
import { signUpPageController } from './page-controllers/signUp.js';
import { signInPageController } from './page-controllers/signIn.js';
import { specifiedCollectionPageController } from './page-controllers/specifiedCollection.js';
import { Auth } from './components/Auth.js';

// Page Controllers ------------------

let userId = '';
let params = new URLSearchParams();
let windowString = '';
params.append('user', `${userId}`);
if(window.location.href.includes(params)) {
   windowString = window.location.href.toString().split('=')[1];
  }
let finalString = '#?user=' + windowString;


// specified collection   
App.addRoute(finalString, specifiedCollectionPageController);

// # (home)
App.addRoute('#', homePageController);

// #search
App.addRoute('#search', searchPageController);

// #collection
App.addRoute('#collection', collectionPageController);

// #collection
App.addRoute('#wishlist', wishlistPageController);

// #signUp
App.addRoute('#signUp', signUpPageController);

// #signIn
App.addRoute('#signIn', signInPageController);

// #signOut
App.addRoute('#signOut', () => {
   // Auth.signOut();
   Auth.signOutModal();

});

// Load app --------------------------
document.addEventListener('DOMContentLoaded', App.init );